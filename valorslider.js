function EnviaValorPWM() {
  const inputPWM = document.querySelector('.sliderPWM .slider');
  const valorPWMenviado = parseInt(inputPWM.value);
  const argumentoPWM = 'PWM'; // para encaixar-se no argumento do servidor remoto
  document.getElementById('valorPWM').textContent = valorPWMenviado;
  EnvioGenerico(argumentoPWM, valorPWMenviado);
}
document.addEventListener('DOMContentLoaded', function () {
  const inputPWM = document.querySelector('.sliderPWM .slider');
  inputPWM.addEventListener('input', function () {
      const valorPWMenviado = parseInt(inputPWM.value);
      const argumentoPWM = 'PWM';
      EnviaValorPWM(argumentoPWM, valorPWMenviado);
  });
});
