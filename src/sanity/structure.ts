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

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        listItem => !['viewMoreProjectsSettings'].includes(listItem.getId() as string)
      ),
    ])
