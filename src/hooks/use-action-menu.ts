export default function useActionMenu() {
  const handleAction = (action) => {
    console.log("handleAction:", action);
  };
  return {
    handleAction,
  };
}
