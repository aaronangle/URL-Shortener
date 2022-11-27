// encodeURL encode the ID of record in the sql table base 89 encodes
module.exports = function (id) {
  return encode(id);
};

function encode(number) {
  const remainder = number % baseEncoderAmount;
  const character = characters[remainder];

  const amountLeft = Math.floor(number / baseEncoderAmount);
  if (amountLeft >= 1) {
    return character + encode(amountLeft);
  } else {
    return character;
  }
}

const characters = ['!', '"', '$', '&', "'", '(', ')', '*', '+', ',', '-', '.', ':', ';', '<', '=', '>', '@', '[', ']', '^', '_', '`', '{', '|', '}', '~'];

addCharacters(48, 57);
addCharacters(65, 90);
addCharacters(97, 122);

function addCharacters(start, end) {
  let string = '';

  for (let i = start; i <= end; i++) {
    string += String.fromCharCode(i);
  }

  characters.push(...string.split(''));
}

const baseEncoderAmount = characters.length;
