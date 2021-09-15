function deleteItem(btn) {
  const itemId = document.querySelector("[name=id]").value;

  const ItemElement = btn.closest('.col-sm-4');

  fetch("/delete/" + itemId, {
    method: "DELETE",
  })
    .then((success) => {
      return success.json();
    }).then(data=>{
      console.log(data);
      ItemElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}
