import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = "kwqamae0";
const dataset = "production";

export default defineConfig({
  name: "d-pizza-studio",
  title: "D-Pizza Food — Menu",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
