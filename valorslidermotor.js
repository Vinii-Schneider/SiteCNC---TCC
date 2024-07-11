function EnviaValorServoSlider() {
  const inputSliderServo = document.querySelector('.sliderPWMmotor .slider');
  const valorServoEnviado = parseInt(inputSliderServo.value);
  const argumento = 'to'; // para encaixar-se no argumento do servidor remoto
  document.getElementById('valorPWM2').textContent = valorServoEnviado;
  EnvioGenerico(argumento, valorServoEnviado);
}
document.addEventListener('DOMContentLoaded', function () {
  const inputSliderServo = document.querySelector('.sliderPWMmotor .slider');
  inputSliderServo.addEventListener('input', function () {
      const valorServoEnviado = parseInt(inputSliderServo.value);
      const argumento = 'to';
      EnviaValorServoSlider(argumento, valorServoEnviado);
  });
});
