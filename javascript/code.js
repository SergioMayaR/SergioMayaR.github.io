var firebaseConfig = {
    apiKey: "AIzaSyC9qC7YZIYFi1sfyp7EVq3xdLAe0YZJNdo",
    authDomain: "empresassindicato-5c068.firebaseapp.com",
    databaseURL: "https://empresassindicato-5c068-default-rtdb.firebaseio.com",
    projectId: "empresassindicato-5c068",
    storageBucket: "empresassindicato-5c068.appspot.com",
    messagingSenderId: "697262847818",
    appId: "1:697262847818:web:98e8ce8fc430b04d9df3b3",
    measurementId: "G-6TGLWBLRG0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var AppAdmin = angular.module('AppAdmin', ["firebase"])

AppAdmin.controller('ctrlLogin', function($scope, $http, $firebaseObject, $firebaseArray) {
    $scope.getLogin = function() {
        $.loader.open(); // opening the loader
        firebase.auth().signInWithEmailAndPassword($scope.obj.getUser, $scope.obj.getPass)
            .then((userCredential) => {
                window.location.href = 'home.html'
            })
            .catch((error) => {
                Swal.fire('Error', "La contraseña no es válida o el usuario no existe.", 'error')
                $.loader.close(true);
            });
    }
    $scope.loginMicrosoft = function() {
        var provider = new firebase.auth.OAuthProvider('microsoft.com');
        provider.addScope('User.Read');
        firebase.auth().signInWithPopup(provider).then(function(result) {})
    }
})
AppAdmin.controller('ctrlHome', function($scope, $http, $firebaseObject, $firebaseArray) {
    $scope.viewData = false;
    $scope.dataMeses = [{
        num: 1,
        mes: "Enero"
    }, {
        num: 2,
        mes: "Febrero"
    }, {
        num: 3,
        mes: "Marzo"
    }, {
        num: 4,
        mes: "Abril"
    }, {
        num: 5,
        mes: "Mayo"
    }, {
        num: 6,
        mes: "Junio"
    }, {
        num: 7,
        mes: "Julio"
    }, {
        num: 8,
        mes: "Agosto"
    }, {
        num: 9,
        mes: "Septiembre"
    }, {
        num: 10,
        mes: "Octubre"
    }, {
        num: 11,
        mes: "Noviembre"
    }, {
        num: 11,
        mes: "Diciembre"
    }]
    $scope.getAuth = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $scope.email = user.email;
                $scope.getPerfil();
            } else {
                window.location.href = 'login.html'
                    // No user is signed in.
            }
        });
    }
    $scope.getAuth();

    $scope.getPerfil = function() {
        $scope.rootDataPerfiles = firebase.database().ref().child('Data/perfiles').orderByChild('Correo').equalTo($scope.email);
        $scope.dataPerfil = $firebaseArray($scope.rootDataPerfiles); //Le pasa el arreglo a una variabble
        $scope.dataPerfil.$loaded().then(function() { //Cuando se cargue correct
            if ($scope.dataPerfil.length) {
                $scope.name = $scope.dataPerfil[0].Nombre;
                $scope.email = $scope.dataPerfil[0].Correo;
                $scope.user = $scope.dataPerfil[0].Correo;
                $scope.tipo = $scope.dataPerfil[0].Tipo;
                $scope.getFirebase();
            } else {
                firebase.auth().currentUser.delete().then(function(user) { //Genera el login en firebase authentication                               '
                    $scope.errorLog = error;
                    $scope.allow = false;
                    $scope.notAllow = true;
                    $.loader.close(true);
                    $("#viewLogo").css('display', 'none');
                    $scope.$apply();
                })
            }
        })
    }
    $scope.getFirebase = function() {
        $scope.rootdataEmpresas = firebase.database().ref().child('Data/empresas')
        $scope.dataEmpresas = $firebaseArray($scope.rootdataEmpresas); //Le pasa el arreglo a una variabble
        $scope.dataEmpresas.$loaded().then(function() { //Cuando se cargue correctamnete los datos                             
            setTimeout(function() {
                $('.select').selectpicker({
                    noneResultsText: 'Sin resultados',
                    title: "Seleccione una opción"
                });
                $("#viewLogo").css('display', 'none');
                $scope.viewAll = true;
                $scope.$apply();
                $.loader.close(); // closing the loader
            }, 100);

        })
    }

    $scope.getEstadosAll = function() {
        if ($scope.newObjecto.tipo == "Foraneas") {
            $.loader.open(); // opening the loader
            $http.get('https://api-sepomex.hckdrk.mx/query/get_estados?token=94b8ba4e-67d4-4430-bf46-80823a811913').then(function(response) {
                $scope.dataEstados = response.data.response.estado;
                $.loader.close(true); //Cierra loader
            }).catch(function(error) {
                $.loader.close(true); //Cierra loader
            })
        }
    }
    $scope.getMunicipios = function() {
        if ($scope.newObjecto.estado) {
            $.loader.open($data); //Abre el loader
            $http.get('https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/' + $scope.newObjecto.estado + '?token=94b8ba4e-67d4-4430-bf46-80823a811913').then(function(response) {
                $scope.dataMunicipios = response.data.response.municipios;
                $.loader.close(true); //Cierra loader
            }).catch(function(error) {
                $.loader.close(true); //Cierra loader
            })
        } else {
            $scope.dataMunicipios = [];
        }
    }
    $scope.clearModalNew = function() {
        $scope.newObjecto = {};
        $("#idSelect1").val("")
        $('.select').selectpicker({
            noneResultsText: 'Sin resultados',
            title: "Seleccione una opción",
        });
        $(".selectV").val('default');
        $(".selectV").selectpicker("refresh");
    }

    $scope.getData = function(data) {
        var rootDataSearch = firebase.database().ref().child('Data/' + data.tipo + '/' + data.$id);
        $scope.dataEdit = $firebaseObject(rootDataSearch); //Le pasa el arreglo a una variabble
        $scope.dataEdit.$loaded().then(function() { //Cuando se cargue correctamnete los datos    $scope.viewCliente = true;
            if ($scope.dataEdit.comentarios == undefined) {
                $scope.dataEdit.comentarios = [];
            }
        })
    }
    $scope.saveComent = function() {
        var obj = {
            user: $scope.email,
            name: $scope.name,
            date: moment().format("DD/MM/YYYY HH:mm"),
            comentario: $scope.sendText
        }
        $scope.dataEdit.comentarios.push(obj)
        $scope.dataEdit.$save().then(function() {
            Swal.fire('Realizado', 'Se agrego correctamente', 'success')
            $scope.sendText = "";
        })
    }
    $scope.getSearch = function() {
        $.loader.open(); // opening the loader    
        if (!$scope.sindicatoSearch) {
            Swal.fire('Error', "Seleccione una opción de tipo", 'error')
            $.loader.close(); // closing the loader
        } else {
            $.loader.open(); // opening the loader  
            if ($scope.tipo == "Lectura") {
                $scope.rootDataSearch = firebase.database().ref().child('Data/' + $scope.sindicatoSearch).orderByChild('correo').equalTo($scope.user);
                $scope.dataSearch = $firebaseArray($scope.rootDataSearch); //Le pasa el arreglo a una variabble
                $scope.dataSearch.$loaded().then(function() { //Cuando se cargue correctamnete los datos    $scope.viewCliente = true;
                    $scope.viewData = true;
                    setTimeout(function() {
                        $.loader.close(); // closing the loader
                    }, 200);
                })
            } else {
                $scope.rootDataSearch = firebase.database().ref().child('Data/' + $scope.sindicatoSearch);
                $scope.dataSearch = $firebaseArray($scope.rootDataSearch); //Le pasa el arreglo a una variabble
                $scope.dataSearch.$loaded().then(function() { //Cuando se cargue correctamnete los datos    $scope.viewCliente = true;
                    $scope.viewData = true;
                    setTimeout(function() {
                        $.loader.close(); // closing the loader
                    }, 200);
                })
            }
        }
    }
    $scope.saveCompra = function() {
        $("#new-compra").modal("hide");
        const rootAdd = firebase.database().ref().child('Data/' + $scope.newObjecto.tipo).orderByChild('dateC').equalTo(new Date().getTime()); //Crea una consulta
        $scope.dataAdd = $firebaseArray(rootAdd); //Le pasa el arreglo a una variabble
        $scope.dataAdd.$loaded().then(function() { //Cuando se cargue correctamnete los datos                        						                                                 
            $scope.dataAdd.$add($scope.newObjecto).then(function(ref) {
                Swal.fire('Realizado', 'Se agrego correctamente', 'success')
                $.loader.close(true);
            }).catch(function(error) {
                Swal.fire('Error', error, 'error')
                $("#new-compra").modal("show");
                $.loader.close(true);
            })
        })
    }
    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
    });
})
AppAdmin.controller('ctrlPerfiles', function($scope, $http, $firebaseObject, $firebaseArray) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    $scope.getAuth = function() {
        google.script.run.withSuccessHandler(function(data) {
            $scope.email = data.email;
            $scope.password = data.password;
            firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function(user) { //Genera el login en firebase authentication                               
                $scope.getPerfil();
            }).catch(function(error) {
                $scope.errorLog = error;
                $scope.allow = false;
                $scope.notAllow = true;
                $.loader.close(true);
                $scope.$apply();
            });
        }).withFailureHandler(function(msg) {
            alert(msg);
            $.loader.close(true);
        }).getUser();
    }
    $scope.getAuth();

    $scope.getPerfil = function() {
        $scope.rootDataPerfiles = firebase.database().ref().child('Data/perfiles').orderByChild('Correo').equalTo($scope.email);
        $scope.dataPerfil = $firebaseArray($scope.rootDataPerfiles);
        $scope.dataPerfil.$loaded().then(function() {
            if ($scope.dataPerfil.length) {
                $scope.name = $scope.dataPerfil[0].Nombre;
                $scope.email = $scope.dataPerfil[0].Correo;
                $scope.tipo = $scope.dataPerfil[0].Tipo;
                if ($scope.tipo == "Administrador") {
                    $scope.getFirebase();
                } else {
                    $scope.errorLog = "Sin acceso Perfil";
                    $scope.allow = false;
                    $scope.notAllow = true;
                    $("#viewLogo").css('display', 'none');
                    $.loader.close(true);
                }
            } else {
                firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function(user) { //Genera el login en firebase authentication                               '
                    user.delete();
                })
                $scope.errorLog = "Sin acceso";
                $scope.allow = false;
                $scope.notAllow = true;
                $("#viewLogo").css('display', 'none');
                $.loader.close(true);
            }
        })
    }
    $scope.getFirebase = function() {
        $scope.RotdataPerfiles = firebase.database().ref().child('Data/perfiles')
        $scope.dataCuentas = $firebaseArray($scope.RotdataPerfiles);
        $scope.dataCuentas.$loaded().then(function() {
            setTimeout(function() {
                $(".fixTable").tableHeadFixer();
            }, 100);
            $("#viewLogo").css('display', 'none');
            $.loader.close();
            $scope.viewAll = true;
        })
    }
    $scope.clearModalNew = function() {
        $scope.newCuenta = {};
        $('#newCuenta-cuenta').val('')
    }
    $scope.newUserCuenta = function() {
        $.loader.open();
        var fly = true;
        for (var t = 0; t < $scope.dataCuentas.length; t++) {
            if ($scope.dataCuentas[t].Correo == $scope.newCuenta.Correo) {
                fly = false;
                break;
            }
        }
        if (fly) {
            $("#new-cuenta").modal("hide")
            $scope.dataCuentas.$add($scope.newCuenta).then(function(ref) {
                google.script.run.withSuccessHandler(function(data) {
                    firebase.auth().createUserWithEmailAndPassword($scope.newCuenta.Correo, data)
                    Swal.fire('Realizado', 'Se agrego correctamente', 'success')
                    $.loader.close(true);
                }).withFailureHandler(function(msg) {
                    alert(msg);
                    $.loader.close(true);
                }).getPassword();
            }).catch(function(error) {
                Swal.fire('Error', error, 'error')
                $("#new-cuenta").modal("show")
                $.loader.close(true);
            })
        } else {
            $("#new-cuenta").modal("show")
            Swal.fire('Error', "El correo ya fue agregado", 'error')
            $("#new-cuenta").modal("show")
            $.loader.close(true);
        }
    }
    $scope.getEdit = function(row) {
        $.loader.open();
        var rootEditUser = firebase.database().ref('Data/perfiles/' + row.$id);
        $scope.editCuenta = $firebaseObject(rootEditUser);
        $scope.editCuenta.$loaded().then(function() {
            $.loader.close(true);
        }).catch(function(error) {
            alert(error);
            $.loader.close(true);
        })
    }
    $scope.saveEdit = function() {
        var fly = true;
        for (var t = 0; t < $scope.dataCuentas.length; t++) {
            if ($scope.dataCuentas[t].Correo == $scope.editCuenta.Correo && $scope.dataCuentas[t].$id != $scope.editCuenta.$id) {
                fly = false;
                break;
            }
        }
        if (fly) {
            swalWithBootstrapButtons.fire({
                title: '¿Deseas actualizar?',
                text: "Los cambios no podrán deshacerse",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'No, Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.loader.open();
                    $("#edit-cuenta").modal("hide");
                    $scope.editCuenta.$save(0).then(function() {
                        google.script.run.withSuccessHandler(function(data) {
                            firebase.auth().createUserWithEmailAndPassword($scope.editCuenta.Correo, data)
                            swalWithBootstrapButtons.fire('Editado', 'Editado correctamente', 'success');
                            $.loader.close(true);
                        }).withFailureHandler(function(msg) {
                            alert(msg);
                            $.loader.close(true);
                        }).getPassword();
                    }).catch(function(error) {
                        alert(error);
                        $("#edit-cuenta").modal("show")
                        $.loader.close(true);
                    })
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelado', 'La operación fue cancelada', 'error')
                }
            })
        } else {
            Swal.fire('Error', "El correo ya fue agregado", 'error')
            $.loader.close(true);
        }
    }
    $scope.removeUser = function(row) {
        swalWithBootstrapButtons.fire({
            title: '¿Desea eliminar al empleado?',
            text: "No podrá recuperar los datos",
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                $.loader.open();
                firebase.database().ref('Data/perfiles/' + row.$id).remove().then(function(ref) {
                    Swal.fire('Eliminado', 'Empleado eliminado', 'success')
                    $.loader.close(true)
                }).catch(function(error) {
                    alert(error);
                    $.loader.close(true);
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('Cancelado', 'La operación fue cancelada', 'error')
            }

        })
    }
    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });
    $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
    });
})