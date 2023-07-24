const nameRegex = /^.{2,60}/;

function validateFields(elements) {
  let error;
  const args = {
    playerNames: []
  };

  for (const element of elements) {
    let fieldName = element.id.replace(/-/g, " ");

    switch (element.type) {
      case 'text':
        if (!nameRegex.test(element.value.trim())) {
          error = `Name of ${fieldName} is required, and number of characters should be in a range [2..60]`;
          return { error };
        }
        args.playerNames = [...args.playerNames, element.value];
        break;
      case 'number':
        const value = parseInt(element.value);
        const min = parseInt(element.min);
        const max = parseInt(element.max);
        if (element.name === 'width') {
          const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          if (value > clientWidth) {
            error = `The width of the game cannot be wider than your screen.(${clientWidth})`;
            return { error };
          }
        }
        if (element.name === 'height') {
          const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;;
          if (value > clientHeight) {
            error = `The height of the game cannot be higher than your screen.(${clientHeight})`;
            return { error };
          }
        }
        if (isNaN(value) || value < min || value > max) {
          error = `Field ${fieldName} should be between ${min} and ${max}.`;
          return { error };
        }
        args[element.name] = value;
        break;
      case 'checkbox':
        args[element.name] = element.checked ? 'dark' : 'standard';
        break;
      default:
        break;
    }
  }

  return { args };
}

function validateForm(event) {
  event.preventDefault();
  const form = document.forms['game-form'];
  const errorMessage = document.querySelector('.error-message');
  errorMessage.textContent = '';

  const { error, args } = validateFields(form.elements);

  if (error) {
    errorMessage.textContent = error;
    return null;
  }

  return args;
}

export default validateForm;