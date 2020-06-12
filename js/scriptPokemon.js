



const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
let listaNomesPokemon = []
let listaPokemonDesordenada = []
let listaPokemon = []

function geraListagem() {
    axios.get("https://pokeapi.co/api/v2/pokemon/?limit=807")
        .then((resposta) => {
            retorno = resposta.data.results
            retorno.forEach((indice) => { listaNomesPokemon.push(indice) })
            listaNomesPokemon.forEach((indice) => {
                axios.get(`https://pokeapi.co/api/v2/pokemon/${indice.name}`)
                    .then((resposta) => {
                        const pokemon = resposta.data
                        var numero = pokemon.id.toString()
                        if (numero.length == 1) { numero = `00${numero}` }
                        if (numero.length == 2) { numero = `0${numero}` }
                        var sprite = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numero}.png`
                        indice.img = sprite
                        var insercao = { name: capitalize(indice.name), img: indice.img, num: numero }
                        listaPokemonDesordenada.push(insercao)
                    })
            })
        })
}

function compare(a, b) {
    if (a.num < b.num) {
        return -1;
    }
    if (a.num > b.num) {
        return 1;
    }
    return 0;
}
// objs.sort(compare);
function organizaListagem() {
    listaPokemon = listaPokemonDesordenada.sort(compare)
    console.log(listaPokemon)
}
function verificaCaixaDeTexto() {
    if (document.getElementById("caixaDeTexto").value == false) {
        alert("Insira um pokemon")
    }
}

var pokemon
var skil = []
var tiposDoPokemon = []
var salvaPokemon = {}


function pesquisaPokemon() {
    var texto = document.getElementById('caixaDeTexto')
    var pesquisa = texto.value.toLowerCase()
    console.log(pesquisa)

    axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisa}`)

        .then((resposta) => {
           
            
                pokemon = resposta.data
                console.log(pokemon)
                var nome = pokemon.name

                console.log('Nome do Pokemon:' + nome)

                salvaPokemon.nome = nome
                document.getElementById("name").innerText = `Pokemon : ${capitalize(pokemon.name)}`
                salvaPokemon.id = pokemon.id.toString()
                if (salvaPokemon.id.length == 1) { salvaPokemon.id = `00${salvaPokemon.id}` }
                if (salvaPokemon.id.length == 2) { salvaPokemon.id = `0${salvaPokemon.id}` }
                salvaPokemon.sprite = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${salvaPokemon.id}.png`
                document.getElementById("sprite").src = salvaPokemon.sprite
                document.getElementById("desc1").src = salvaPokemon.sprite
                document.getElementById("desc2").src = salvaPokemon.sprite
                document.getElementById("desc3").src = salvaPokemon.sprite



                var listaDeSkill = []
                var habilidades = pokemon.abilities
                habilidades.forEach(habilidades => {



                    var nskill = habilidades.ability.name
                    var urlSkill = `https://pokeapi.co/api/v2/ability/${nskill}`
                    var descriSkill = ""
                    axios.get(urlSkill)
                        .then((resposta) => {
                            for (var i = 0; i < resposta.data.effect_entries.length; i++) {
                                if (resposta.data.effect_entries[i].language.name == "en") {
                                    var retornoDaAbilitiy = resposta.data.effect_entries[i].short_effect
                                }
                            }
                            descriSkill = retornoDaAbilitiy
                            listaDeSkill.push(`Habilidade: ${nskill} Efeito: ${descriSkill}`)
                            document.getElementById("skill").innerHTML = `${listaDeSkill.join("\n")}<br>`

                        })


                });
                salvaPokemon.skill = listaDeSkill

                console.log('***Habilidades do Pokemon***\n' + skil.join("\n"))


                var tipos = pokemon.types
                tipos.forEach(tipos => {
                    tiposDoPokemon.push(tipos.type.name)
                    salvaPokemon.type = tiposDoPokemon


                })
                document.getElementById("type").innerText = `Tipos: ${capitalize(salvaPokemon.type.join(", "))}`

                console.log('***Tipos do Pokemon***\n' + tiposDoPokemon.join('\n'))


                console.log(salvaPokemon)

            })

        .catch((erro) => {
            console.log(erro)
        })


}



$(function () {
    listaPokemon;
    $("#caixaDeTexto").autocomplete({
        minLength: 1,
        source: function (request, response) {
            response($.map(listaPokemon, function (obj, key) {

                var name = obj.name.toUpperCase();

                if (name.indexOf(request.term.toUpperCase()) != -1) {
                    return {
                        label: obj.name, // Label for Display
                        // value: obj.id // Value
                        img: obj.img,
                        num: obj.num
                    }
                } else {
                    return null;
                }
            }));
        },
        focus: function (event, ui) {
            event.preventDefault();
        },
        // Once a value in the drop down list is selected, do the following:
        select: function (event, ui) {
            event.preventDefault();
            // place the person.given_name value into the textfield called 'select_origin'...
            $('#caixaDeTexto').val(ui.item.label);
            pesquisaPokemon()
            // ... any other tasks (like setting Hidden Fields) go here...
        },
        html: true,
        open: function (event, ui) {
            $(".ui-autocomplete").css("z-index", 1000);

        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            // return $("<li><div><img src=" + item.img + "><span>" + item.value + "</span></div></li>").appendTo(ul);
            return $(`<li><div><img src=${item.img}><span> N° ${item.num} - </span><span>${item.value}</span></div></li>`).appendTo(ul);
        };
})

