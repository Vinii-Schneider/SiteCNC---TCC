document.getElementById("butaodesligaled").addEventListener("click", desligaled);
function desligaled() {
estadoled = false;
atualizaEstado();
Enviaestado("desligaled");
}