



const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
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
            if(resposta.data === []){
                window.alert("Você não escolheu um Pokémon ");

            }
            else{

            pokemon = resposta.data
            console.log(pokemon)
            var nome = pokemon.name

            console.log('Nome do Pokemon:' + nome)

            salvaPokemon.nome = nome
            document.getElementById("name").innerText = `Pokemon : ${capitalize(pokemon.name)}`
        salvaPokemon.id = pokemon.id.toString()
        if(salvaPokemon.id.length==1){salvaPokemon.id=`00${salvaPokemon.id}`}
        if(salvaPokemon.id.length==2){salvaPokemon.id=`0${salvaPokemon.id}`}
        salvaPokemon.sprite = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${salvaPokemon.id}.png`
document.getElementById("sprite").src = salvaPokemon.sprite


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
        }
        })

        .catch((erro) => {
            console.log(erro)
        })


}
