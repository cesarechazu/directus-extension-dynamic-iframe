# Dynamic iFrame

Embed a secure external page inside a Directus alias field using a URL template.

This interface is useful for showing dashboards, previews, reports, or external tools directly inside the item editor, based on the current form values.

This pattern is especially useful for embedded analytics and reporting dashboards, where the URL needs to change according to the record currently being edited.

## Interface

<img
  src="https://raw.githubusercontent.com/cesarechazu/directus-extension-dynamic-iframe/main/img/interface.png"
  alt="Dynamic iFrame interface"
  width="720"
/>

## Features

- Renders an external page inside an iframe
- Resolves placeholders from the current form values
- Updates the iframe URL when referenced form values change
- Supports configurable debounce before reloading
- Optional loading indicator
- Optional open in new tab shortcut
- Optional fullscreen permission
- Supports custom height
- Supports custom border styling
- Supports custom border radius
- **Accepts only `https` URLs**
- Shows a placeholder when the URL is missing or invalid
- Works as an `alias` field, so it does not create a database column

## Options

- `url_template`: target page template, for example `https://example.com?client={{client_id}}`
- `height`: iframe height, for example `800px` (default `800px`)
- `debounce`: delay in milliseconds before updating the iframe URL, default `250`
- `loading`: show a visual loading indicator while the iframe reloads, default `true`
- `border`: any valid CSS border value
- `border_radius`: any valid CSS border radius value
- `open_in_new_tab`: show a shortcut to open the resolved URL in a new tab, default `false`
- `allow_fullscreen`: enables fullscreen support on the iframe, default `false`

## Dynamic Placeholders

The `url_template` can use values from other fields in the current item form.

Examples:

- `https://example.com/dashboard?client={{client_id}}`
- `https://example.com/report/{{id}}`
- `https://example.com/embed?customer={{customer.id}}`
- `https://example.com/embed?customer={{customer.id}}&name={{customer.name}}`

Supported placeholder formats:

- `{{field_name}}`: reads a top-level field from the current form
- `{{relation.id}}`: reads nested values using dot notation
- `{{id}}`: resolves the current item primary key


## Usage Example

One practical use case is a singleton collection used as a control panel or embedded reporting view.

Example setup:

- Create a singleton collection
- Add a many-to-one field such as `customer_id` related to a `customers` collection
- Add a second field using the `Dynamic iFrame` interface as an `alias` field
- Configure the iframe `url_template` like:
  - `https://example.com/dashboard?customer={{customer_id}}`

Behavior:

- When the user changes the selected customer in the `customer_id` field
- Directus updates the form state immediately
- The iframe resolves the new `{{customer_id}}` value
- The iframe reloads automatically after the configured debounce

This makes it useful for filtered dashboards, contextual previews, embedded reports, or any external page that needs to react to other field values in the current form.

## Notes

- This interface only renders secure (`https`) pages.
- Some websites block embedding with `X-Frame-Options` or `Content-Security-Policy`.
- This interface works best with pages that are designed to be embedded.
