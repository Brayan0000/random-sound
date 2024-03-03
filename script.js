// Variaveis constantes
const cpt_value = document.getElementsByClassName("cpt-value")
const cpt_slider = document.getElementById("cpt-slider")
const sit_value = document.getElementsByClassName("sit-value")
const sit_slider = document.getElementById("sit-slider")
const volume_value = document.getElementsByClassName("volume-value")
const volume_slider = document.getElementById("volume-slider")
const history = document.getElementById("htr-text")
const sound_list = document.getElementById("sound-list")
const sound_file_input = document.getElementById("sound-file-input")
const sidebar = document.getElementById("sidebar")
const normal_sounds = [
    "assets/sounds/discord_call.mp3",
    "assets/sounds/discord_notification.mp3",
    "assets/sounds/guitar.mp3",
    "assets/sounds/knocking_door.mp3",
    "assets/sounds/pipe.mp3",
    "assets/sounds/spongebob_fail.mp3"
]
// Outras variaveis
var time = 60
var last_second = [0]
var chance_to_play = 0
var db
if (localStorage.sounds) {}
else {
    localStorage.sounds = JSON.stringify([])
}

if (localStorage.soundsName) {}
else {
    localStorage.soundsName = JSON.stringify([])
}

if (localStorage.soundsActives) {}
else {
    var activiesArray = []
    var local_sounds = JSON.parse(localStorage.sounds)
    normal_sounds.forEach(function(item, index) {
        activiesArray[index] = true
    })
    local_sounds.forEach(function(item, index) {
        activiesArray[index + normal_sounds.length] = true
    })
    localStorage.soundsActives = JSON.stringify(activiesArray)
}

// Funções básicas
reset = function() {
    var popup = document.getElementById("pop-up")
    popup.style.opacity = 1
}
resetYes = function() {
    var popup = document.getElementById("pop-up")
    popup.style.opacity = 0
    
    localStorage.sounds = JSON.stringify([])

    localStorage.soundsName = JSON.stringify([])

    window.indexedDB.deleteDatabase("SoundDB")

    var activiesArray = []
    var local_sounds = JSON.parse(localStorage.sounds)
    normal_sounds.forEach(function(item, index) {
        activiesArray[index] = true
    })
    local_sounds.forEach(function(item, index) {
        activiesArray[index + normal_sounds.length] = true
    })
    localStorage.soundsActives = JSON.stringify(activiesArray)

    location.reload()
}
resetNo = function() {
    var popup = document.getElementById("pop-up")
    popup.style.opacity = 0
}

// Atualizar valor nos textos
cpt_update = function() {
    var valor = cpt_slider.value
    chance_to_play = valor
    for (var i = 0; i < cpt_value.length; i++) {
        cpt_value[i].innerHTML = valor
    }
}
sit_update = function() {
    var valor = sit_slider.value
    time = valor
    for (var i = 0; i < sit_value.length; i++) {
        sit_value[i].innerHTML = valor
    }
}
volume_update = function() {
    var valor = volume_slider.value
    var childs = sound_list.childNodes
    for (var i = 0; i < volume_value.length; i++) {
        volume_value[i].innerHTML = valor
    }
    childs.forEach(function(item) {
        item.volume = valor * 0.01
    })
}
cpt_slider.addEventListener("input", cpt_update)
sit_slider.addEventListener("input", sit_update)
volume_slider.addEventListener("input", volume_update)

// Historico
addHistory = function(text, type) {
    var newHistory = document.createElement("p")
    newHistory.innerHTML = text
    newHistory.classList.add("htr-" + type)
    var oldHistory = history.firstChild
    history.insertBefore(newHistory, oldHistory)
}

// Tempo
setInterval(function() {
    last_second[0]++
    if (last_second[0] >= time) {
        last_second[0] = 0
        willPlayASound()
    }
}, 1000)

// Tocar som aleatório
playRandomSound = function() {
    var localSounds = JSON.parse(localStorage.sounds)
    var is_on = JSON.parse(localStorage.soundsActives)
    var is_active = true
    var rng = Math.floor(Math.random() * (normal_sounds.length + localSounds.length))
    var playedSound

    if (rng >= normal_sounds.length) {
        if (is_on[rng]) {var playedSound = document.getElementById("Usound-" + (rng - normal_sounds.length))}
        else {
            playRandomSound()
            random_depth++
            is_active = falses
        }
    } else {
        if (is_on[rng]) {var playedSound = document.getElementById("sound-" + rng)}
        else {
            playRandomSound()
            random_depth++
            is_active = false
        }
    }

    if (is_active) {
        var hora = new Date()
        playedSound.play()
        addHistory(playedSound.dataset.name + " played at " + hora.getHours() + ":" + hora.getMinutes() + ":" + hora.getSeconds(), "info")
    }
}

willPlayASound = function() {
    var rng = Math.floor(Math.random() * 100)
    if (rng < chance_to_play) {
        playRandomSound()
        console.log("conseguiu")
    } else {console.log("tentou")}
}

// Banco de dados
startDB = function() {
    var request = window.indexedDB.open("SoundDB", 1)

    request.onupgradeneeded = function(event) {
        db = event.target.result
        var db_os = db.createObjectStore("sounds", { autoIncrement : true })
        addHistory("New database for sounds created", "info")
    }

    request.onsuccess = function(event) {
        db = event.target.result
        addHistory("Database loaded with success", "info")
        startSounds()
    }

    request.onerror = function(event) {
        addHistory("Error on open data base: " + event.target.error + "\n No sounds loaded", "error")
    }
}
startDB()

// criar toggle para som
toggle_for_sound = function(name, local, index) {
    var data_is_on = JSON.parse(localStorage.soundsActives)
    if (local) {
        var new_input = document.createElement("input")
        new_input.type = "checkbox"
        new_input.checked = data_is_on[index + 6]
        new_input.id = "toggle-" + (index + 6)
        new_input.addEventListener("input", function() {
            var sound_tt = JSON.parse(localStorage.soundsActives)
            if (sound_tt[index + 6]) {sound_tt[index + 6] = false}
            else {sound_tt[index + 6] = true}
            localStorage.soundsActives = JSON.stringify(sound_tt)
        })

        var new_label = document.createElement("label")
        new_label.setAttribute("for", "toggle-" + (index + 6))

    } else {
        var new_input = document.createElement("input")
        new_input.type = "checkbox"
        new_input.checked = data_is_on[index]
        new_input.id = "toggle-" + index
        new_input.addEventListener("input", function() {
            var sound_tt = JSON.parse(localStorage.soundsActives)
            if (sound_tt[index]) {sound_tt[index] = false}
            else {sound_tt[index] = true}
            localStorage.soundsActives = JSON.stringify(sound_tt)
        })

        var new_label = document.createElement("label")
        new_label.setAttribute("for", "toggle-" + index)
    }

    var new_div = document.createElement("div")
    new_div.className = "sound-toggle"

    var new_p = document.createElement("p")
    new_p.innerText = name

    new_div.appendChild(new_p)
    new_div.appendChild(new_input)
    new_div.appendChild(new_label)
    sidebar.appendChild(new_div)
}

startSounds = function() {
    for (var _i = 0; _i < normal_sounds.length; _i++) {
        var newSound = document.createElement("audio")
        var newSoundName = normal_sounds[_i].split("/")
        newSoundName = newSoundName[newSoundName.length - 1]

        newSound.src = normal_sounds[_i]
        newSound.id = "sound-" + _i
        newSound.dataset.name = newSoundName

        sound_list.appendChild(newSound)
        console.log(newSoundName)

        toggle_for_sound(newSoundName, false, _i)
    }
    var transaction = db.transaction(["sounds"], "readonly")
    var db_os = transaction.objectStore("sounds")
    var request = db_os.getAll()
    
    request.onsuccess = function(event) {
        var db_sounds = event.target.result
        var sound_name = JSON.parse(localStorage.soundsName)

        for (var i = 0; i < db_sounds.length; i++) {
            var newSound = document.createElement("audio")
            
            var sound_url = URL.createObjectURL(db_sounds[i])
            newSound.src = sound_url
            newSound.id = "Usound-" + i
            newSound.dataset.name = sound_name[i]

            sound_list.appendChild(newSound)
            console.log(sound_name[i])

            toggle_for_sound(sound_name[i], true, i)
        }
    }
}

// Som da database para url em elemnt
newElementUrlDB = function() {
    var transaction = db.transaction(["sounds"], "readonly")
    var db_os = transaction.objectStore("sounds")
    var request = db_os.getAll()

    request.onsuccess = function(event) {
        var db_sounds = event.target.result

        var pre_sound = db_sounds[db_sounds.length - 1]
        var sound_index = db_sounds.length - 1

        var sound_array = JSON.parse(localStorage.sounds)
        var localNames = JSON.parse(localStorage.soundsName)

        var exist = false

        for (var i = 0; i < localNames.length; i++) {
            if (localNames[i] == pre_sound.name) {
                exist = true
                break
            }
        }

        if (exist) {
            addHistory(pre_sound.name + " already exist", "error")
        } else {
            var url_sound = URL.createObjectURL(pre_sound)
            console.log(url_sound)

            var new_sound = new Audio(url_sound)
            new_sound.id = "Usound-" + sound_array.length
            sound_array.push(sound_index)
            localStorage.sounds = JSON.stringify(sound_array)

            localNames.push(pre_sound.name)
            localStorage.soundsName = JSON.stringify(localNames)

            new_sound.dataset.name = pre_sound.name

            sound_list.appendChild(new_sound)
            toggle_for_sound(pre_sound.name, true, sound_array.length - 1)
            addHistory(pre_sound.name + " added with success", "info")
        }

        }
    }


// Upload de som
sound_file_update = function() {
    var name = sound_file_input.files[0].name
    var item = sound_file_input.files[0]
    console.log("trying to upload " + name)

    if (name.toLowerCase().endsWith(".mp3")) {
        var transaction = db.transaction(["sounds"], "readwrite")
        var db_os = transaction.objectStore("sounds")
        var add_request = db_os.add(item)

        add_request.onsuccess = function(event) {
            newElementUrlDB()
        }

        add_request.onerror = function(event) {
            addHistory("Error on saving the sound: " + event.target.error)
        }

    } else {
        addHistory("This isn\'t a mp3 file", "error")
    }
}
sound_file_input.addEventListener("input", sound_file_update)