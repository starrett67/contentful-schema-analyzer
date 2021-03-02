# Contentful Content Type Tree

## Description
This tool displays a dependency tree of a contentful content type. I built this tool so I could better understand how my organization was using content and where the dependencies were.

## Requirements
- Nodejs
- Contentful management token (Needed for more granular content type information from api)

## Usage
```
Usage: contentful-content-tree [options]

A tool to display a dependencies tree of content types.

Options:
  -V, --version                 output the version number
  -s,--space <value>            Contentful Space Id
  -e,--environment <value>      Contentful environment name (default: "master")
  -r,--rootContentType <value>  Root Content Type ID for the tree (default: "page")
  -t,--managementToken <value>  Contentful management token
  -h, --help                    display help for command
```

### Example
`contentful-content-tree -s [SPACE_ID] -e [ENVIRONMENT_ID] -t [CONTENT_MANAGEMENT_TOKEN] -r store`

Output:
```
└─ store
   ├─ seo
   │  └─ accordion
   ├─ blog
   ├─ banner
   │  ├─ link
   │  │  └─ url
   │  └─ button
   │     └─ link
   │        └─ url
   └─ bannerV3
      ├─ link
      │  └─ url
      └─ bannerV3Section
         ├─ link
         │  └─ url
         └─ bannerV3ContentWrapper
            ├─ bannerV3Button
            │  └─ link
            │     └─ url
            └─ bannerV3Text
```