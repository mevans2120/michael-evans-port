import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton settings
      S.listItem()
        .title('View More Projects Settings')
        .child(
          S.editor()
            .id('viewMoreProjectsSettings')
            .schemaType('viewMoreProjectsSettings')
            .documentId('viewMoreProjectsSettings')
        ),

      S.listItem()
        .title('Related Posts Settings')
        .child(
          S.editor()
            .id('relatedPostsSettings')
            .schemaType('relatedPostsSettings')
            .documentId('relatedPostsSettings')
        ),

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        listItem => !['viewMoreProjectsSettings', 'relatedPostsSettings'].includes(listItem.getId() as string)
      ),
    ])
