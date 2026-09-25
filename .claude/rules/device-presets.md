---
paths:
  - "src/device-presets/**"
---

# Device preset rules

- A device frame is one object literal in `presets.ts`, built with the
  `define.ts` builder for its family. Put a value shared by a family in the
  builder, not in each literal.
- Geometry is in pixels at `DEVICE_PRESET_REFERENCE_WIDTH`, drawn with CSS and
  SVG only: no bitmaps, logos or vendor artwork.
- Preset ids are stored in project configs. Don't rename or remove one;
  relabel it instead.
- Every preset is in the snapshot in `__snapshots__/index_test.ts.snap`. After
  an intended change, run `deno task test -- --update` and check the diff.
