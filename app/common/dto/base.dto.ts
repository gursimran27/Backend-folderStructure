// *Data Transfer Object (DTO)
// *The base.dto.ts file defines a BaseSchema interface, which represents a common structure for objects that require certain fields like _id, createdAt, and updatedAt. This is typically used to ensure consistency across various data models in your application, particularly in MongoDB documents where each document will have these standard fields.

export interface BaseSchema {
  _id: string;//This field is usually the unique identifier for each document in MongoDB. It's automatically created by MongoDB when a document is inserted unless explicitly defined.
  createdAt: string;//This field represents the timestamp of when the document was created. It's typically set to the current time when the document is inserted into the database.
  updatedAt: string;//This field holds the timestamp for the last update made to the document. Every time the document is modified, this field is usually updated.
}


// *old method to generate types usign type Alias for objects.
// type Name ={
//   _id: String,
//   createdAt: String,
//   updatedAt: String
// }
