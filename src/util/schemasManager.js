import { Schema, arrayOf } from 'normalizr'

import invariants from '../invariants'
import { ContentTypes, ContentTypesPlural } from '../constants'

const api = { __flush__, getAll, createSchema, init }

export default api

/** Schema object cache, populated in `makeSchemas`. */
let schemas

/** Individual schema definitions, defined like this so we can reference one from another. */
let categorySchema, mediaSchema, pageSchema, postSchema, revisionSchema, tagSchema, userSchema,
  commentSchema, postTypeSchema, postStatusSchema, taxonomySchema

/** Invalidate the schema object cache. */
function __flush__ () {
  schemas = null
}

/** Get the schema object cache. */
function getAll () {
  return schemas
}

/** Create a custom schema definition (for custom content types). */
function createSchema (name, idAttribute) {
  invariants.isOk(schemas, 'createSchema called before cache populated.')
  invariants.isString('name', name)
  invariants.isString('idAttribute', idAttribute)

  const contentTypeSchema = new Schema(name, { idAttribute })

  contentTypeSchema.define({
    author: userSchema,
    post: postSchema
  })

  return contentTypeSchema
}

/** Populate the cache of schemas for built-in content types. */
function init (idAttribute) {
  invariants.isString('idAttribute', idAttribute)

  if (schemas) return schemas

  // Content types with `id` properties
  categorySchema = new Schema(ContentTypesPlural[ContentTypes.Category], { idAttribute })
  commentSchema = new Schema(ContentTypesPlural[ContentTypes.Comment], { idAttribute })
  mediaSchema = new Schema(ContentTypesPlural[ContentTypes.Media], { idAttribute })
  pageSchema = new Schema(ContentTypesPlural[ContentTypes.Page], { idAttribute })
  postSchema = new Schema(ContentTypesPlural[ContentTypes.Post], { idAttribute })
  revisionSchema = new Schema(ContentTypesPlural[ContentTypes.PostRevision], { idAttribute })
  tagSchema = new Schema(ContentTypesPlural[ContentTypes.Tag], { idAttribute })
  userSchema = new Schema(ContentTypesPlural[ContentTypes.User], { idAttribute })

  // Content types without `id` properties
  postTypeSchema = new Schema(ContentTypesPlural[ContentTypes.PostType], { idAttribute: 'slug' })
  postStatusSchema = new Schema(ContentTypesPlural[ContentTypes.PostStatus], { idAttribute: 'slug' })
  taxonomySchema = new Schema(ContentTypesPlural[ContentTypes.Taxonomy], { idAttribute: 'slug' })

  mediaSchema.define({
    author: userSchema,
    post: postSchema
  })

  pageSchema.define({
    author: userSchema
  })

  postSchema.define({
    author: userSchema,
    categories: arrayOf(categorySchema),
    tags: arrayOf(tagSchema)
  })

  schemas = {
    [ContentTypes.Category]: categorySchema,
    [ContentTypes.Comment]: commentSchema,
    [ContentTypes.Media]: mediaSchema,
    [ContentTypes.Page]: pageSchema,
    [ContentTypes.Post]: postSchema,
    [ContentTypes.PostStatus]: postStatusSchema,
    [ContentTypes.PostType]: postTypeSchema,
    [ContentTypes.PostRevision]: revisionSchema,
    [ContentTypes.Tag]: tagSchema,
    [ContentTypes.Taxonomy]: taxonomySchema,
    [ContentTypes.User]: userSchema
  }

  return schemas
}
