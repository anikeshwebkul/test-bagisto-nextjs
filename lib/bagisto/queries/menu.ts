export const getMenuQuery = /* GraphQL */ `
  query homeCategories {
    homeCategories(
      input: [
        { key: "parent_id", value: "1" }
        { key: "locale", value: "en" }
        { key: "status", value: "1" }
        { key: "limit", value: "3" }
      ]
      getCategoryTree: false
    ) {
      id
      # categoryId
      # position
      # logoPath
      logoUrl
      # status
      # displayMode
      # lft
      # rgt
      # parentId
      # additional
      bannerPath
      # bannerUrl
      name
      slug
      # urlPath
      description
      metaTitle
      metaDescription
      metaKeywords
      # localeId
      # createdAt
      # updatedAt
    }
  }
`;
