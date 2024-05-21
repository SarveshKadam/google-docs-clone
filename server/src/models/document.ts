import { model, Schema } from "mongoose";

export interface IDocument {
  _id: string;
  data: object;
}

const documentSchema = new Schema<IDocument>({
  _id: { type: String, required: true },
  data: { type: Object },
});

export const DocumentModel = model<IDocument>("documents", documentSchema);
