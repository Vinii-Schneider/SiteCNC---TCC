function EnviarAnguloservo() {
    const inputAngulo = document.querySelector('.GrauServo .form-control');
    const angulo = parseInt(inputAngulo.value);
    const argumentoservo = 'to' //para encaixar-se no argumento do servidor remoto
    EnvioGenerico(argumentoservo, angulo);
}
document.addEventListener('DOMContentLoaded', function () {
    const inputAngulo = document.querySelector('.GrauServo .form-control');
    inputAngulo.addEventListener('change', function () {
        EnviarAnguloservo();
    });
});