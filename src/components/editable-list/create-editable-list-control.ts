export default function createEditableListControl(options?: L.ControlOptions) {
  const controlExtension = L.Control.extend({
    onAdd: function (map) {
      console.log({ add: map });
      const container = L.DomUtil.create("div");
      container.innerHTML = "Editable List Control";
      return container;
    },
    onRemove: function (map) {
      // Nothing to do here
      console.log({ remove: map });
    },
  });

  const controlOptions = { ...options };
  return new controlExtension(controlOptions);
}
