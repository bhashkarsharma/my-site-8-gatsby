import Img, { FluidObject } from 'gatsby-image'
import { Header } from '@components/header'
import { BaseTemplate } from '@templates/base'
import { graphql } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const ImageGrid = styled.div`
  [class^='col-'] {
    padding: 0;
    position: relative;

    &:hover {
      .caption {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .caption {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.8em;
    height: 100%;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    transition: visibility 0s, opacity 0.5s linear;
    visibility: hidden;
    width: 100%;
    z-index: 2;

    div {
      padding: 0.5em;
    }
  }
`

interface GalleryProps {
  data: {
    allJsonJson: {
      edges: {
        node: {
          photos: GalleryImage[]
        }
      }[]
    }
  }
}

interface GalleryImage {
  caption?: string
  location?: string
  taken_at?: string
  path: {
    childImageSharp: {
      fluid: FluidObject
    }
  }
}

const GalleryPage: React.FunctionComponent<GalleryProps> = ({ data }) => {
  const photos: GalleryImage[] = data.allJsonJson.edges[0].node.photos
  return (
    <BaseTemplate>
      <Header headerText="Gallery" logoSize={25} />
      <ImageGrid className="row">
        {photos.map((photo: GalleryImage, index: number) => (
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="caption">
              <div>{photo.caption}</div>
            </div>
            <Img fluid={photo.path.childImageSharp.fluid} alt={photo.caption} title={photo.caption} />
          </div>
        ))}
      </ImageGrid>
    </BaseTemplate>
  )
}

export const PageQuery = graphql`
  query GalleryQuery {
    allJsonJson {
      edges {
        node {
          photos {
            path {
              childImageSharp {
                fluid(maxWidth: 1200) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
            caption
            location
            taken_at
          }
        }
      }
    }
  }
`

export default GalleryPage
