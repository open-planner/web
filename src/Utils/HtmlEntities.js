export default {
  decode(value) {
    const element = document.createElement('textarea');
    element.innerHTML = value;

    return element.value;
  }
}
