# Contentful Schema Analyzer

## Description
This tool displays schema information about your contentful content types.

## Requirements
- Nodejs
- Contentful management token (Needed for more granular content type information from api)

## Usage
```
Usage: csa [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  tree            display dependency tree of content type
  links           display the most links a content type's entries has
  help [command]  display help for command
```

### Example
`csa tree -s [SPACE_ID] -e [ENVIRONMENT_ID] -t [CONTENT_MANAGEMENT_TOKEN] -r store`

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