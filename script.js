/*
 Copyright (C) 2021 sixtysixgames
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/* 
 Created on : 2021-10-09
 Author     : sixtysixgames
 */
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
//https://javascript.info/regexp-methods
//http://world-english.org/english500.htm
//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function isVowel(w) {
    if (w == null || w.length == 0) {
        return false;
    }
    w = w.toLowerCase();
    let c = w.charAt(w.length - 1);
    if (c == "a" || c == "e" || c == "i" || c == "o" || c == "u" || c == "y") {
        return true;
    }
    return false;
}
/*
 function isEnd(w){
 if(w == null || w.length == 0){
 return false;
 }
 //c = w.charAt(w.length - 1);
 if(w == "_"){
 return true;
 }
 return false;
 }
 */

function doStuff3() {
//alert("doStuff3");
    let space = " ";
    let starts = new Array();
    let followers = new Array();
    let hyphen = "-";
    let hyphenreplace = "hqphqn";
    let hyphenregexp = new RegExp(hyphenreplace, "gi");

    let words = document.getElementById("theCorpus").value;
    if (words == "") {
        document.getElementById("theCorpus").value = "Somebody forgot to enter some words!  This will only work if there are some words entered into this textbox.";
        words = document.getElementById("theCorpus").value;
        //return false;
    }
    words = words.trim();

    let markovdepthval = document.getElementById("markovdepth").value;
    let markovdepth = parseInt(markovdepthval);

    // replace hyphens
    words = words.replace(/[\-]+/g, hyphenreplace);

    // substitute punctuation with space
    words = words.replace(/[\W0-9]+/g, space);
    // add a space to start and end
    //words = space + words + space;

    let wordArr = words.split(' ');
    //alert("word count: " + wordArr.length);

    let dict = {}; // hashtable

    for (let wordIndex = 0; wordIndex < wordArr.length; wordIndex++) {
        let word = wordArr[wordIndex];
        //alert(word);
        let isFirstChar = true;
        let isStartToken = true;
        let startToken = "";
        let token = "";
        let isVowelToken = false;
        let prevToken = "";
        let isVowelChar = false;

        for (let charIndex = 0; charIndex < word.length; charIndex++) {
            let c = word.charAt(charIndex);
            isVowelChar = isVowel(c);

            if (isFirstChar) {
                token = "_" + c;
                isFirstChar = false;
                if (isVowelChar && c.toLowerCase() != "y") {
                    isVowelToken = true;
                } else {
                    isVowelToken = false;
                }
            } else {
                if (c.toLowerCase() == "y") {
                    // is it acting as a vowel or a consonant?
                    if (isVowel(token)) {
                        isVowelChar = false;
                    } else {
                        isVowelChar = true;
                    }
                }

                if ((isVowelChar && isVowelToken) || (!isVowelChar && !isVowelToken)) {
                    //alert("build: token=" + token + ". c=" + c);
                    // build the token
                    token += c;
                    if (charIndex == word.length - 1) {
                        // it's an end
                        token += "_";
                        // add to prevToken's followers
                        if (dict[prevToken] != null) {
                            dict[prevToken][dict[prevToken].length] = token;
                        }
                        //alert("build eow: " + token);
                    }
                }

                if ((isVowelChar && !isVowelToken) || (!isVowelChar && isVowelToken)) {
                    //alert("change: token=" + token + ". c=" + c);
                    // we are changing token
                    isVowelToken = !isVowelToken;
                    if (isStartToken) {
                        isStartToken = false;
                    } else {
                        // add to prevToken's followers
                        if (dict[prevToken] != null) {
                            dict[prevToken][dict[prevToken].length] = token;
                        }
                    }
                    // current token becomes previous token
                    prevToken = token;

                    // create new entry, if not exists
                    if (dict[prevToken] == null) {
                        dict[prevToken] = new Array();
                    }
                    // start new token
                    token = c;
                    if (charIndex == word.length - 1) {
                        // it's an end
                        token += "_";
                        // add to prevToken's followers
                        if (dict[prevToken] != null) {
                            dict[prevToken][dict[prevToken].length] = token;
                        }
                        //alert("change eow: " + token);
                    }
                }
            }
            //alert("token=" + token);

        }
        let n = wordIndex;
    }
//https://stackoverflow.com/questions/890807/iterate-over-a-javascript-associative-array-in-sorted-order
//https://stackoverflow.com/questions/10062317/iterating-through-an-object-hashtable
//Object.keys(dict).forEach(function (key) { 
//    var value = dict[key]
//    // iteration code
//})
    //var ustarts = starts.filter(onlyUnique);
    let ustarts = Object.keys(dict).sort();
    ustarts = ustarts.filter(onlyUnique);
    ustarts.sort();
    //document.getElementById("ustarts").innerHTML = ustarts.join(" ");
    //
    // finally output
    let followstring = "<dl>";
    for (let index = 0; index < ustarts.length; ++index) {
        dict[ustarts[index]].sort();
        //dict[ustarts[index]] = dict[ustarts[index]].filter(onlyUnique);
        followstring += "<dt>" + ustarts[index] + "</dt>";
        followstring += "<dd>" + dict[ustarts[index]].join(" ") + "</dd>";
    }
    followstring += "</dl>";
    //document.getElementById("followers").innerHTML = followstring;

    // right now make up some words
    // get a random start
    // while not an end
    let newWords = [];
    for (let i = 0; i < 100; i++) {
        let newWord = "";
        let newStart = ustarts[rand(ustarts.length - 1)]
        while (newStart.charAt(0) != "_") {
            newStart = ustarts[rand(ustarts.length - 1)]
        }
        newWord += newStart;

        let follow = dict[newStart][rand(dict[newStart].length - 1)];
        newWord += follow;
        let count = 1;
        while (follow.charAt(follow.length - 1) != "_") {
            follow = dict[follow][rand(dict[follow].length - 1)];
            newWord += follow;
            count++;
            if (count > markovdepth) {
                //break;
                //restart
                count = 1;
                newWord = newStart;
                follow = dict[newStart][rand(dict[newStart].length - 1)];
                newWord += follow;
            }
        }
        // remove underscores
        newWord = newWord.replace(/_/g, "");

        // put hyphens back
        newWord = newWord.replace(hyphenregexp, hyphen);
        if(!newWords.includes(newWord)){
            newWords.push(newWord);
        }
    }
    newWords.sort();
    
    // output
        document.getElementById("newwords").innerHTML = "";
        document.getElementById("newwords").innerHTML += newWords.join(", ");
    //
    return false;
}
function rand(i) {
    let ret = Math.random() * i;
    ret = Math.round(ret);
    return ret;
}
function clearWords() {
    document.getElementById("theCorpus").value = "";
    document.getElementById("newwords").innerHTML = "";
    return false;
}

function doElements() {
//alert("elements");
    document.getElementById("newwords").innerHTML = "";

    document.getElementById("theCorpus").value = "Hydrogen Helium Lithium Beryllium Boron Carbon Nitrogen Oxygen Fluorine Neon \
Sodium Magnesium Aluminium Silicon Phosphorus Sulphur Chlorine Argon Potassium Calcium Scandium \
Titanium Vanadium Chromium Manganese Iron Cobalt Nickel Copper Zinc Gallium Germanium \
Arsenic Selenium Bromine Krypton Rubidium Strontium Yttrium Zirconium Niobium Molybdenum Technetium \
Ruthenium Rhodium Palladium Silver Cadmium Indium Tin Antimony Tellurium Iodine Xenon \
Cesium Barium Lanthanum Cerium Praseodymium Neodymium Promethium Samarium Europium Gadolinium Terbium \
Dysprosium Holmium Erbium Thulium Ytterbium Lutetium Hafnium Tantalum Tungsten Rhenium Osmium \
Iridium Platinum Gold Mercury Thallium Lead Bismuth Polonium Astatine Radon Francium \
Radium Actinium Thorium Protactinium Uranium Neptunium Plutonium Americium Curium Berkelium Californium \
Einsteinium Fermium Mendelevium Nobelium Lawrencium Rutherfordium Dubnium Seaborgium Bohrium Hassium \
Meitnerium Darmstadtium Roentgenium Copernicium Nihonium Flerovium Moscovium Livermorium Tennessine Oganesson";

    doStuff3();
    return false;
}

function doCountries() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
Afghanistan, Albania, Algeria, Andorra, Angola, Antigua-And-Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, \
Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia-And-Herzegovina, Botswana, Brazil, Brunei, Bulgaria, Burkina-Faso, Burundi, \
Cabo-Verde, Cambodia, Cameroon, Canada, Central-African-Republic, Chad, Chile, China, Colombia, Comoros, \
Democratic-Republic-Of-The-Congo, Republic-Of-The-Congo, Costa-Rica, Ivory-Coast, Croatia, Cuba, Cyprus, Czechia, \
Denmark, Djibouti, Dominica, Dominican-Republic, \
Ecuador, Egypt, El-Salvador, Equatorial-Guinea, Eritrea, Estonia, Eswatini, Ethiopia, \
Fiji, Finland, France, \
Gabon, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala, Guinea, Guinea-Bissau, Guyana, \
Haiti, Honduras, Hungary, \
Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, \
Jamaica, Japan, Jordan, \
Kazakhstan, Kenya, Kiribati, Kosovo, Kuwait, Kyrgyzstan, \
Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, \
Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall-Islands, Mauritania, Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Myanmar, \
Namibia, Nauru, Nepal, Netherlands, New-Zealand, Nicaragua, Niger, Nigeria, North-Korea, North-Macedonia, Norway, \
Oman, \
Pakistan, Palau, Palestine, Panama, Papua-New-Guinea, Paraguay, Peru, Philippines, Poland, Portugal, \
Qatar, \
Romania, Russia, Rwanda, \
Saint-Kitts-And-Nevis, Saint-Lucia, Saint-Vincent-And-The-Grenadines, Samoa, San-Marino, Sao-Tome-And-Principe, Saudi-Arabia, Senegal, Serbia, Seychelles, Sierra-Leone, Singapore, Slovakia, \
Slovenia, Solomon-Islands, Somalia, South-Africa, South-Korea, South-Sudan, Spain, Sri-Lanka, Sudan, Suriname, Sweden, Switzerland, Syria, \
Taiwan, Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tonga, Trinidad-And-Tobago, Tunisia, Turkey, Turkmenistan, Tuvalu, \
Uganda, Ukraine, United-Arab-Emirates, United-Kingdom, United-States-Of-America, Uruguay, Uzbekistan, \
Vanuatu, Vatican-City, Venezuela, Vietnam, \
Yemen, \
Zambia, Zimbabwe";

    doStuff3();
    return false;

}

function doCounties() {
//https://www.jamesharding.net/list-of-uk-counties/
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "Bedfordshire, Berkshire, Bristol, Buckinghamshire, \
Cambridgeshire, Cheshire, City-Of-London, Cornwall, County-Durham, Cumbria, Derbyshire, Devon, Dorset, East-Riding-Of-Yorkshire, East-Sussex, Essex, Gloucestershire, \
Greater-London, Greater-Manchester, Hampshire, Herefordshire, Hertfordshire, Humberside, Isle-Of-Wight, Isles-Of-Scilly, Kent, Lancashire, Leicestershire, Lincolnshire, \
Merseyside, Middlesex, Norfolk, North-Somerset, North-Yorkshire, Northamptonshire, Northumberland, Nottinghamshire, Oxfordshire, Rutland, Shropshire, Somerset, \
South-Gloucestershire, South-Yorkshire, Staffordshire, Suffolk, Surrey, Tyne-And-Wear, Warwickshire, West-Midlands, West-Sussex, West-Yorkshire, Wiltshire, Worcestershire";

    doStuff3();
    return false;
}

function doStates() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, \
Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, \
Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New-Hampshire, New-Jersey, \
New-Mexico, New-York, North-Carolina, North-Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode-Island, South-Carolina, \
South-Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West-Virginia, Wisconsin, Wyoming";
    doStuff3();
    return false;
}

function doCommonWords() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
the name of very to through and just form in much is great it think you say that help\
 he low was line for before on turn are cause with same as mean differ his move they right be boy\
 at old one too have does this tell from sentence or set had three by want hot air but well some also\
 what play there small we end can put out home other read were hand all port your large when spell up add\
 use even word land how here said must an big each high she such which follow do act their why time ask\
 if men will change way went about light many kind then off them need would house write picture like try so us these \
 again her animal long point make mother thing world see near him build two self has earth look father\
 more head day stand could own go page come should did country my found sound answer no school most grow number study\
 who still over learn know plant water cover than food call sun first four people thought may let down keep side eye\
 been never now last find door any between new city work tree part cross take since get hard place start made might\
 live story where saw after far back sea little draw only left round late man run year don't came while show press\
 every close good night me real give life our few under stop open ten seem simple together several next vowel white toward\
 children war begin lay got against walk pattern example slow ease centre paper love often person always money music serve those appear\
 both road mark map book science letter rule until govern mile pull river cold car notice feet voice care fall second power\
 group town carry fine took certain rain fly eat unit room lead friend cry began dark idea machine fish note mountain wait\
 north plan once figure base star hear box horse noun cut field sure rest watch correct colour able face pound wood done\
 main beauty enough drive plain stood girl contain usual front young teach ready week above final ever gave red green list oh\
 though quick feel develop talk sleep bird warm soon free body minute dog strong family special direct mind pose behind leave clear\
 song tail measure produce state fact product street black inch short lot numeral nothing class course wind stay question wheel happen full\
 complete force ship blue area object half decide rock surface order deep fire moon south island problem foot piece yet told busy\
 knew test pass record farm boat top common whole gold king possible size plane heard age best dry hour wonder better laugh\
 true thousand during ago hundred ran am check remember game step shape early yes hold hot west miss ground brought interest heat\
 reach snow fast bed five bring sing sit listen perhaps six fill table east travel weight less language morning among";
    doStuff3();
    return false;
}
function doHamlet() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
To be, or not to be: that is the question: \
Whether ’tis nobler in the mind to suffer \
The slings and arrows of outrageous fortune, \
Or to take arms against a sea of troubles, \
And by opposing end them? To die: to sleep; \
No more; and by a sleep to say we end \
The heart-ache and the thousand natural shocks \
That flesh is heir to, ’tis a consummation \
Devoutly to be wish’d. To die, to sleep; \
To sleep: perchance to dream: ay, there’s the rub; \
For in that sleep of death what dreams may come \
When we have shuffled off this mortal coil, \
Must give us pause: there’s the respect \
That makes calamity of so long life; \
For who would bear the whips and scorns of time, \
The oppressor’s wrong, the proud man’s contumely, \
The pangs of despised love, the law’s delay, \
The insolence of office and the spurns \
That patient merit of the unworthy takes, \
When he himself might his quietus make \
With a bare bodkin? who would fardels bear, \
To grunt and sweat under a weary life, \
But that the dread of something after death, \
The undiscovered country from whose bourn \
No traveller returns, puzzles the will \
And makes us rather bear those ills we have \
Than fly to others that we know not of? \
Thus conscience does make cowards of us all; \
And thus the native hue of resolution \
Is sicklied over with the pale cast of thought, \
And enterprises of great pith and moment \
With this regard their currents turn awry, \
And lose the name of action. Soft you now! \
The fair Ophelia! Nymph, in thy orisons \
Be all my sins remembered.";
    doStuff3();
    return false;
}
//https://a-z-animals.com/animals/group/
function doMammals() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
Aardvark, Anteater, Antelope, Armadillo, Aye-Aye, \
Baboon, Badger, Bandicoot, Bat, Bear, Beaver, Binturong, Bison, Boar, Bobcat, Bongo, Bonobo, Buffalo, \
Camel, Capuchin, Capybara, Caracal, Cat, Chamois, Cheetah, Chimpanzee, Chinchilla, Chipmunk, Civet, Coati, Cougar, Cow, Coyote, Cuscus, \
Deer, Dhole, Dingo, Dog, Dolphin, Donkey, Dormouse, Dugong, \
Echidna, Elephant,  \
Ferret, Fossa, Fox, \
Gerbil, Gibbon, Giraffe, Goat, Gopher, Gorilla, Guineapig, \
Hamster, Hare, Hedgehog, Hippopotamus, Horse, Human, Hyena, \
Impala, Indri, \
Jackal, Jaguar, \
Kangaroo, Koala, Kudu, \
Lemming, Lemur, Leopard, Liger, Lion, Llama, Lynx, \
Macaque, Manatee, Mandrill, Markhor, Marmoset, Meerkat, Mole, Mongoose, Monkey, Moose, Mouse, Mule, \
Numbat, \
Ocelot, Okapi, Opossum, Orangutan, Otter, \
Pademelon, Panda, Panther, Peccary, Pig, Pika, Platypus, Porcupine, Possum, Puma, \
Quokka, Quoll, \
Rabbit, Raccoon, Rat, Reindeer, Rhinoceros, Hyrax, \
Saola, Sealion, Seal, Serval, Sheep, Shrew, Skunk, Sloth, Squirrel, Seacow, Stoat, \
Tamarin, Tapir, Tarsier, Tasmanian Devil, Tiger, \
Uakari, Vole, \
Wallaby, Walrus, Warthog, Weasel, Whale, Wildebeest, Wolf, Wolverine, Wombat, \
Yak, Zebra, Zebu, Zonkey, Zorse \
";
    doStuff3();
    return false;
}
//https://en.wikipedia.org/wiki/List_of_birds_by_common_name
function doBirds() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
Accentor, Adjutant, Albatross, Alethe, Amazon, Ani, Anhinga, Antbird, Antpipit, Antpitta, Antshrike, Antthrush, Antvireo, Antwren, Apalis, Apostlebird, Aracari, Argus, Asity, Astrapia, Attila, Auk, Auklet, Avocet, Avocetbill, Awlbill, \
Babbler, Balicassiao, Bamboowren, Bananaquit, Banded-Pitta, Barbet, Barbthroat, Bare-Eye, Bateleur, Batis, Baza, Bee-Eater, Bellbird, Bentbill, Bernieria, Berrypecker, Besra, Bird-Of-Paradise, Bishop, Bittern, Blackbird, Blackcap, Blackeye, Bleeding-Heart, Blossomcrown, Bluebill, Bluebird, Bluebonnet, Bluejay, Bluethroat, Boatbill, Bobolink, Bobwhite, Bokikokiko, Bokmakierie, Boobook, Booby, Bowerbird, Brambling, Brilliant, Bristlebird, Bristlefront, Bristlehead, Broadbill, Bronzewing, Brushturkey, Budgerigar, Bufflehead, Bulbul, Bullfinch, Bunting, Bush-Hen, Bushbird, Bushchat, Bushcrow, Bushshrike, Bushtit, Bustard, Butcherbird, Buttonquail, Buzzard, \
Cacique, Calyptura, Camaroptera, Canary, Canastero, Canvasback, Capercaillie, Caracara, Cardinal, Carib, Casiornis, Cassowary, Catbird, Chachalaca, Cachalote, Chaffinch, Chat, Chat-tyrant, Chickadee, Chicken, Chiffchaff, Chlorophonia, Chough, Chowchilla, Cicadabird, Cinclodes, Cisticola, Cochoa, Cockatiel, Cockatoo, Condor, Coquette, Comet, Conebill, Coot, Corella, Cormorant, Coronet, Cotinga, Coua, Coucal, Courser, Cowbird, Crake, Crane, Creeper, Crescentchest, Crombec, Crossbill, Crow, Cuckoo, Cuckoo-Dove, Cuckooshrike, Curassow, Curlew, Currawong, \
Dacnis, Darter, Dickcissel, Dipper, Diucon, Dollarbird, Donacobius, Doradito, Dotterel, Dove, Dowitcher, Drongo, Drongo-Cuckoo, Duck, Dunlin, Dunnock, \
Eagle, Eagle-Owl, Egret, Eider, Elaenia, Elepaio, Emerald, Emu, Emutail, Eremomela, Euphonia, \
Fairy, Fairy-Bluebird, Fairywren, Falcon, Falconet, Fantail, Fernbird, Fernwren, Fieldfare, Fieldwren, Figbird, Finch, Finfoot, Fire-Eye, Fireback, Firecrown, Firefinch, Firewood-Gatherer, Fiscal, Flameback, Flamingo, Flatbill, Flicker, Florican, Flowerpecker, Flowerpiercer, Flufftail, Flycatcher, Flycatcher-Shrike, Fody, Foliage-Gleaner, Forktail, Francolin, Friarbird, Frigatebird, Frogmouth, Fruiteater, Fulmar, Fulvetta, \
Gadwall, Galah, Gallinule, Gallito, Gannet, Garganey, Gerygone, Gibberbird, Gnatcatcher, Gnateater, Gnatwren, Go-Away-Bird, Godwit, Goldcrest, Goldeneye, Goldenface, Goldenthroat, Goldfinch, Goose, Goshawk, Grackle, Grassbird, Grassquit, Grasswren, Grebe, Greenbul, Greenfinch, Greenshank, Grenadier, Grosbeak, Grouse, Guaiabero, Guan, Guillemot, Guineafowl, Gull, Gyrfalcon, \
Hardhead, Harrier, Hamerkop, Hawfinch, Hawk, Hawk-Cuckoo, Hawk-Owl, Heathwren, Helmetcrest, Helmetshrike, Hemispingus, Hermit, Heron, Hillstar, Hoatzin, Hobby, Honeybird, Honeycreeper, Honeyeater, Honeyguide, Hoopoe, Hoopoe-lark, Hornbill, Hornero, Huet-Huet, Huia, Hummingbird, Hypocolius, \
Ibis, Ibisbill, Illadopsis, Inca, Inezia, Iora, Iiwi, \
Jabiru, Jacamar, Jacobin, Jaeger, Jacana, Jackdaw, Jay, Jery, Jewelfront, Junco, Junglefowl, \
Kagu, Kaka, Kakapo, Kea, Kestrel, Killdeer, Kingbird, Kingfisher, Kinglet, Kiskadee, Kite, Kittiwake, Kiwi, Knot, Kokako, Koel, Korhaan, \
Lancebill, Lapwing, Lark, Laughingthrush, Leafbird, Limpkin, Linnet, Logrunner, Longbill, Longclaw, Longspur, Longtail, Loon, Lorikeet, Lory, Lovebird, Lyrebird, \
Macaw, Magpie, Magpie-Lark, Maleo, Malimbe, Mallard, Malleefowl, Malkoha, Manakin, Mango, Manucode, Martin, Meadowlark, Megapode, Merganser, Merlin, Mesia, Mesite, Metaltail, Millerbird, Miner, Minivet, Minla, Mistletoebird, Moa, Mockingbird, Monal, Monarch, Monjita, Monklet, Moorhen, Morepork, Motmot, Mountaineer, Mountaingem, Mourner, Mousebird, Munia, Murre, Murrelet, Myna, Myzornis, \
Nativehen, Needletail, Negrito, Neopipo, Newtonia, Nighthawk, Nightingale, Nightjar, Niltava, Noddy, Nothura, Nunbird, Nunlet, Nutcracker, Nuthatch, \
Oilbird, Oriole, Oropendola, Osprey, Ostrich, Ouzel, Ovenbird, Owl, Owlet, Owlet-Nightjar, Oxpecker, Oxylabes, Oystercatcher, \
Painted-Snipe, Palmchat, Paradigalla, Paradise-Crow, Parakeet, Pardalote, Pardusco, Parisoma, Parotia, Parrot, Parrotbill, Parrotfinch, Partridge, Parula, Peacock, Peafowl, Pelican, Penguin, Peppershrike, Petrel, Petronia, Pewee, Phalarope, Pheasant, Philentoma, Phoebe, Piapiac, Picathartes, Piculet, Piedtail, Pigeon, Pilotbird, Pintail, Pipit, Piprites, Pitohui, Pitta, Plantain-Eater, Plantcutter, Plover, Plovercrest, Plumeleteer, Pochard, Poorwill, Potoo, Pratincole, Prinia, Prion, Ptarmigan, Puffbird, Puffin, Puffleg, Pyrrhuloxia, Pytilia, \
Quail, Quail-Dove, Quail-Thrush, Quelea, Quetzal, \
Racket-Tail, Rail, Raven, Rayadito, Razorbill, Redhead, Redpoll, Redshank, Redstart, Redthroat, Reedling, Rhea, Riflebird, Rifleman, Ringneck, Roadrunner, Robin, Rockfowl, Rockjumper, Rockrunner, Rockwarbler, Roller, Rook, Rosefinch, Rosella, Rosy-Finch, Ruby, Ruff, \
Sabrewing, Saddleback, Saltator, Sanderling, Sandgrouse, Sandpiper, Sapphire, Sapphirewing, Satinbird, Scaup, Schiffornis, Scythebill, Scimitarbill, Scoter, Screamer, Scrub-Robin, Scrubbird, Scrubfowl, Scrubtit, Scrubwren, Secretarybird, Seedeater, Seedsnipe, Seriema, Shag, Sharpbill, Sheartail, Shearwater, Sheathbill, Shelduck, Sheldgoose, Shikra, Shoebill, Shortwing, Shoveler, Shrike, Shrike-Flycatcher, Shrike-Tanager, Shrike-Thrush, Shrike-Tit, Shrike-Tyrant, Shrikebill, Shrikethrush, Sibia, Sicklebill, Silktail, Silvereye, Sirystes, Siskin, Sittella, Skimmer, Skua, Skylark, Smew, \
Snipe, Snowcap, Snowcock, Snowfinch, Solitaire, Songlark, Sora, Spadebill, Sparrow, Sparrow-Lark, Sparrowhawk, Spatuletail, Spinifexbird, Spinebill, Spinetail, Spoonbill, Spurfowl, Starfrontlet, Starling, Starthroat, Stitchbird, Stilt, Stint, Stone-Curlew, Stonechat, Stork, Streamertail, Stubtail, Sugarbird, Sunangel, Sunbeam, Sunbird, Sunbird-Asity, Sunbittern, Sungem, Sungrebe, Surfbird, Swallow, Swamphen, Swan, Swift, Swiftlet, Sylph, \
Tachuri, Tailorbird, Takahe, Tanager, Tapaculo, Tattler, Tchagra, Teal, Tern, Tesia, Tetraka, Thamnornis, Thick-Knee, Thicketbird, Thornbill, Thorntail, Thrasher, Thrush, Tinamou, Tinkerbird, Tit, Tit-Tyrant, Tit-Warbler, Titmouse, Tody, Tody-Flycatcher, Tody-Tyrant, Topaz, Torrent-Lark, Toucan, Toucanet, Towhee, Tragopan, Trainbearer, Treecreeper, Treepie, Treeswift, Trembler, Triller, Trogon, Tropicbird, Trumpeter, Tui, Turca, Turkey, Turnstone, Twinspot, Twistwing, Tyrannulet, Tyrant, \
Uguisu, Umbrellabird, \
Vanga, Veery, Velvetbreast, Verdin, Visorbearer, Violetear, Vireo, Vulture, \
Wagtail, Wagtail-Tyrant, Wallcreeper, Warbler, Watercock, Waterhen, Waterthrush, Wattlebird, Wattle-Eye, Waxbill, Waxwing, Weaver, Wedgebill, Weebill, Weka, Wheatear, Whip-Poor-Will, Whipbird, Whistler, White-eye, Whiteface, Whitestart, Whitethroat, Whitetip, Whydah, Widowbird, Wigeon, Willet, Winter, Woodcock, Woodcreeper, Woodhen, Woodlark, Woodnymph, Woodpecker, Woodshrike, Woodstar, Woodswallow, Wren, Wrenthrush, Wrentit, Wrybill, Wryneck, \
Xenops, Yellowbrow, Yellowhammer, Yellowlegs, Yellownape, Yellowthroat, Yuhina, \
";
    doStuff3();
    return false;
}
//https://en.wikipedia.org/wiki/List_of_animal_names

///https://en.wikipedia.org/wiki/List_of_fish_common_names
function doFish() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
    African-glass-catfish African-lungfish Aholehole Airbreathing-catfish Airsac-catfish Alaska-blackfish Albacore Alewife Alfonsino Algae-eater Alligatorfish Alligator-gar Amberjack American-sole Amur-pike Anchovy Anemonefish Angelfish Angler Angler-catfish Anglerfish Antarctic-cod Antarctic-icefish Antenna-codlet Arapaima Archerfish Arctic-char Armored-gurnard Armored-searobin Armorhead Armorhead-catfish Armoured-catfish Arowana Arrowtooth-eel Asian-carps Asiatic-glassfish Atka-mackerel Atlantic-bonito Atlantic-cod Atlantic-herring Atlantic-salmon Atlantic-sharpnose-shark Atlantic-saury Atlantic-silverside Australasian-salmon Australian-grayling Australian-herring Australian-lungfish Australian-prowfish Ayu Baikal-oilfish Bala-shark Ballan-wrasse Bamboo-shark Banded-killifish Bandfish Banjo Bangus Banjo-catfish Barb Barbel Barbeled-dragonfish Barbeled-houndshark Barbel-less-catfish Barfish Barracuda Barracudina Barramundi Barred-danio Barreleye Basking-shark Bass Basslet Batfish Bat-ray Beachsalmon Beaked-salmon Beaked-sandfish Beardfish Beluga-sturgeon Bengal-danio Betta Bichir Bicolor-goat-fish Bigeye Bigeye-squaretail Bighead-carp Bigmouth-buffalo Bigscale Bigscale-pomfret Billfish Bitterling Black-angelfish Black-bass Black-dragonfish Blackchin Blackfin-Tuna Blackfish Black-neon-tetra Blacktip-reef-shark Black-mackerel Black-scalyfin Black-sea-bass Black-scabbardfish Black-swallower Black-tetra Black-triggerfish Bleak Blenny Blind-goby Blind-shark Blobfish Blowfish Blue-catfish Blue-danio Blue-redstripe-danio Blue-eye-trevalla Bluefin-tuna Bluefish Bluegill Blue-gourami Blue-shark Blue-triggerfish Blue-whiting Bluntnose-knifefish Bluntnose-minnow Boafish Boarfish Bobtail-snipe-eel Bocaccio Boga Bombay-duck Bonefish Bonito Bonnethead-shark Bonnetmouth Bonytail Bonytongue Bowfin Boxfish Bramble-shark Bream Brill Bristlemouth Bristlenose-catfish Broadband-dogfish Bronze-corydoras Brook-lamprey Brook-stickleback Brook-trout Brotula Brown-trout Buffalo-fish Bullhead Bullhead-shark Bull-shark Bull-trout Burbot Bumblebee-goby Buri Burma-danio Burrowing-goby Butterfish Butterfly-ray Butterflyfish California-flyingfish California-halibut Canary-rockfish Candiru Candlefish Capelin Cardinalfish Cardinal-tetra Carp Carpetshark Carpsucker Catalufa Catfish Catla Cat-shark Cavefish Celebes-rainbowfish Central-mudminnow Chain-pickerel Channel-bass Channel-catfish Char Cherry-salmon Chimaera Chinook-salmon Cherubfish Chub Chubsucker Chum-salmon Cichlid Cisco Climbing-catfish Climbing-gourami Climbing-perch Clingfish Clownfish Clown-loach Clown-triggerfish Cobbler Cobia Cod Codlet Codling Coelacanth Coffinfish Coho-salmon Coley Collared-carpetshark Collared-dogfish Colorado-squawfish Combfish Combtail-gourami Combtooth-blenny Common-carp Common-tunny Conger-eel Convict-blenny Convict-cichlid Cookie-cutter-shark Coolie-loach Cornetfish Cowfish Cownose-ray Cow-shark Crappie Creek-chub Crestfish Crevice-kelpfish Croaker Crocodile-icefish Crocodile-shark Crucian-carp Cuckoo-wrasse Cusk Cusk-eel Cutlassfish Cutthroat-eel Cutthroat-trout Dab Dace Daggertooth-pike-conger Damselfish Danio Darter Dartfish Dealfish Death-Valley-pupfish Deep-sea-eel Deep-sea-smelt Deepwater-cardinalfish Deepwater-flathead Deepwater-stingray Delta-smelt Demoiselle Denticle-herring Desert-pupfish Devario Devil-ray Dhufish Discus Dogfish Dogfish-shark Dogteeth-tetra Dojo-loach Dolly-Varden-trout Dolphin-fish Dorab-wolf-herring Dorado Dory Dottyback Dragonet Dragonfish Dragon-goby Driftfish Driftwood-catfish Drum Duckbill Duckbill-eel Dusky-grouper Dusky-shark Dwarf-gourami Dwarf-loach Eagle-ray Earthworm-eel Eel Eel-cod Eel-goby Eelpout Eeltail-catfish Elasmobranch Electric-catfish Electric-eel Electric-knifefish Electric-ray Elephant-fish Elephantnose-fish Elver Ember-parrotfish Emerald-catfish Emperor Emperor-angelfish Emperor-bream Escolar Eucla-cod Eulachon European-chub European-eel European-flounder European-minnow European-perch False-brotula False-cat-shark False-moray False-trevally Fangtooth Fathead-sculpin Featherback Fierasfer Fire-goby Filefish Finback-cat-shark Fingerfish Fire-bar-danio Firefish Flabby-whale-fish Flagblenny Flagfin Flagfish Flagtail Flashlight-fish Flatfish Flathead Flathead-catfish Flier Flounder Flying-gurnard Flying-fish Footballfish Forehead-brooder Four-eyed-fish French-angelfish Freshwater-eel Freshwater-hatchetfish Freshwater-shark Frigate-mackerel Frilled-shark Frogfish Frogmouth-catfish Fusilier-fish Galjoen-fish Ganges-shark Gar Garden-eel Garibaldi Garpike Ghost-fish Ghost-flathead Ghost-knifefish Ghost-pipefish Ghost-shark Ghoul Giant-danio Giant-gourami Giant-sea-bass Gibberfish Gila-trout Gizzard-shad Glass-catfish Glassfish Glass-knifefish Glowlight-danio Goatfish Goblin-shark Goby Golden-dojo Golden-loach Golden-shiner Golden-trout Goldeye Goldfish Gombessa Goosefish Gopher-rockfish Gourami Grass-carp Graveldiver Grayling Gray-mullet Gray-reef-shark Great-white-shark Green-swordtail Greeneye Greenling Grenadier Green-spotted-puffer Ground-shark Grouper Grunion Grunt Grunter Grunt-sculpin Gudgeon Guitarfish Gulf-menhaden Gulper-eel Gulper Gunnel Guppy Gurnard Haddock Hagfish Hairtail Hake Halfbeak Halfmoon Halibut Halosaur Hamlet Hammerhead-shark Hammerjaw Handfish Hardhead-catfish Harelip-sucker Hatchetfish Hawkfish Herring Herring-smelt Hickory-Shad Hillstream-loach Hog-sucker Hoki Horn-shark Horsefish Houndshark Huchen Humuhumunukunukuapua'a Hussar Icefish Ide Ilish/Hilsha Inanga Inconnu Jack Jackfish Jack-Dempsey Japanese-eel Javelin Jawfish Jellynose-fish Jewelfish Jewel-tetra Jewfish John-Dory Kafue-pike Kahawai Kaluga Kanyu Kelp-perch Kelpfish Killifish King-of-the-herrings Kingfish King-of-the-salmon Kissing-gourami Knifefish Knifejaw Koi Kokanee Kokopu Kuhli-loach Labyrinth-fish Ladyfish Lake-chub Lake-trout Lake-whitefish Lampfish Lamprey Lancetfish Lanternfish Largemouth-bass Leaffish Leatherjacket Lefteye-flounder Lemon-shark Lemon-sole Lemon-tetra Lenok Leopard-danio Lightfish Limia Lined-sole Ling Ling-cod Lionfish Livebearer Lizardfish Loach Loach-catfish Loach-goby Loach-minnow Longfin Longfin-dragonfish Longfin-escolar Longfin-smelt Long-finned-char Long-finned-pike Long-finned-sand-diver Longjaw-mudsucker Longneck-eel Longnose-chimaera Longnose-dace Longnose-lancetfish Longnose-sucker Longnose-whiptail-catfish Long-whiskered-catfish Loosejaw Lost-River-sucker Louvar Loweye-catfish Luderick Luminous-hake Lumpsucker Lungfish Mackerel Mackerel-shark Madtom Mahi-mahi Mahseer Mail-cheeked-fish Mako-shark Mandarinfish Manefish Man-of-war-fish Manta-ray Marblefish Marine-hatchetfish Marlin Masu-salmon Medaka Medusafish Megamouth-shark Menhaden Merluccid-hake Mexican-golden-trout Midshipman-fish Milkfish Minnow Minnow-of-the-deep Modoc-sucker Mojarra Mola-mola Monkeyface-prickleback Monkfish Mooneye Moonfish Moorish-idol Mora Moray-eel Morid-cod Morwong Moses-sole Mosquitofish Mouthbrooder Mozambique-tilapia Mrigal Mud-catfish Mudfish Mudminnow Mud-minnow Mudskipper Mudsucker Mullet Mummichog Murray-cod Muskellunge Mustache-triggerfish Mustard-eel Naked-back-knifefish Nase Needlefish Neon-tetra New-World-rivuline New-Zealand-sand-diver New-Zealand-smelt Nibble-fish Noodlefish North-American-darter North-American-freshwater-catfish North-Pacific-daggertooth Northern-anchovy Northern-clingfish Northern-lampfish Northern-pike Northern-sea-robin Northern-squawfish Northern-stargazer Notothen Nurseryfish Nurse-shark Oarfish Ocean-perch Ocean-sunfish Oceanic-whitetip-shark Oilfish Oldwife Old-World-knifefish Olive-flounder Opah Opaleye Orange-roughy Orangespine-unicorn-fish Orangestriped-triggerfish Orbicular-batfish Orbicular-velvetfish Oregon-chub Orfe Oriental-loach Oscar Owens-pupfish Pacific-albacore Pacific-cod Pacific-hake Pacific-herring Pacific-lamprey Pacific-salmon Pacific-saury Pacific-trout Pacific-viperfish Paddlefish Pancake-batfish Panga Paradise-fish Parasitic-catfish Parore Parrotfish Peacock-flounder Peamouth Pearleye Pearlfish Pearl-danio Pearl-perch Pelagic-cod Pelican-eel Pelican-gulper Pencil-catfish Pencilfish Pencilsmelt Peppered-corydoras Perch Peters-elephantnose-fish Pickerel Pigfish Pike-conger Pike-eel Pike Pikeblenny Pikeperch Pilchard Pilot-fish Pineapplefish Pineconefish Pink-salmon Pintano Pipefish Piranha Pirarucu Pirate-perch Plaice Platy Platyfish Pleco Plownose-chimaera Poacher Pollyfish Pollock Pomfret Pompano Pompano-dolphinfish Ponyfish Popeye-catalufa Porbeagle-shark Porcupinefish Porgy Port-Jackson-shark Powen Prickleback Pricklefish Prickly-shark Prowfish Pufferfish Pumpkinseed Pupfish Pygmy-sunfish Queen-danio Queen-parrotfish Queen-triggerfish Quillback Quillfish Rabbitfish Raccoon-butterfly-fish Ragfish Rainbow-trout Rainbowfish Rasbora Ratfish Rattail Ray Razorback-sucker Razorfish Red-grouper Red-salmon Red-snapper Redfin-perch Redfish Redhorse-sucker Redlip-blenny Redmouth-whalefish Redtooth-triggerfish Red-velvetfish Red-whalefish Reedfish Reef-triggerfish Remora Requiem-shark Ribbon-eel Ribbon-sawtail-fish Ribbonfish Rice-eel Ricefish Ridgehead Riffle-dace Righteye-flounder Rio-Grande-perch River-loach River-shark River-stingray Rivuline Roach Roanoke-bass Rock-bass Rock-beauty Rock-cod Rocket-danio Rockfish Rockling Rockweed-gunnel Rohu Ronquil Roosterfish Ropefish Rough-scad Rough-sculpin Roughy Roundhead Round-herring Round-stingray Round-whitefish Rudd Rudderfish Ruffe Russian-sturgeon Sabalo Sabertooth Saber-toothed-blenny Sabertooth-fish Sablefish Sacramento-blackfish Sacramento-splittail Sailfin-silverside Sailfish Salamanderfish Salmon Salmon-shark Sandbar-shark Sandburrower Sand-dab Sand-diver Sand-eel Sandfish Sand-goby Sand-knifefish Sand-lance Sandperch Sandroller Sand-stargazer Sand-tiger Sand-tilefish Sandbar-shark Sarcastic-fringehead Sardine Sargassum-fish Sauger Saury Sawfish Saw-shark Sawtooth-eel Scabbard-fish Scaly-dragonfish Scat Scissortail-rasbora Scorpionfish Sculpin Scup Sea-bass Sea-bream Sea-catfish Sea-chub Sea-devil Sea-dragon Sea-lamprey Sea-raven Sea-snail Sea-toad Seahorse Seamoth Searobin Sevan-trout Sergeant-major Shad Shark Sharksucker Sharpnose-puffer Sheatfish Sheepshead Sheepshead-minnow Shiner Shortnose-chimaera Shortnose-sucker Shovelnose-sturgeon Shrimpfish Siamese-fighting-fish Sillago Silver-carp Silver-dollar Silver-dory Silver-hake Silverside Silvertip-tetra Sind-danio Sixgill-ray Sixgill-shark Skate Skilfish Skipjack-tuna Slender-mola Slender-snipe-eel Sleeper Sleeper-shark Slickhead Slimehead Slimy-mackerel Slimy-sculpin Slipmouth Smalleye-squaretail Smalltooth-sawfish Smelt Smelt-whiting Smooth-dogfish Snailfish Snake-eel Snakehead Snake-mackerel Snapper Snipe-eel Snipefish Snook Snubnose-eel Snubnose-parasitic-eel Sockeye-salmon Soldierfish Sole South-American-darter South-American-lungfish Southern-Dolly-Varden Southern-flounder Southern-hake Southern-sandfish Southern-smelt Spadefish Spaghetti-eel Spanish-mackerel Spearfish Speckled-trout Spiderfish Spikefish Spinefoot Spiny-basslet Spiny-dogfish Spiny-dwarf-catfish Spiny-eel Spinyfin Splitfin Spookfish Spotted-climbing-perch Spotted-danio Spottail-pinfish Sprat Springfish Squarehead-catfish Squaretail Squawfish Squeaker Squirrelfish Staghorn-sculpin Stargazer Starry-flounder Steelhead Stickleback Stingfish Stingray Stonecat Stonefish Stoneroller-minnow Stream-catfish Striped-bass Striped-burrfish Sturgeon Sucker Suckermouth-armored-catfish Summer-flounder Sundaland-noodlefish Sunfish Surf-sardine Surfperch Surgeonfish Swallower Swamp-eel Swampfish Sweeper Swordfish Swordtail Tadpole-cod Tadpole-fish Tailor Taimen Tang Tapetail Tarpon Tarwhine Telescopefish Temperate-bass Temperate-ocean-bass Temperate-perch Tench Tenpounder Tenuis Tetra Thorny-catfish Thornfish Threadfin Threadfin-bream Thread-tail Three-spot-gourami Threespine-stickleback Three-toothed-puffer Thresher-shark Tidewater-goby Tiger-barb Tigerperch Tiger-shark Tiger-shovelnose-catfish Tilapia Tilefish Titan-triggerfish Toadfish Tommy-ruff Tompot-blenny Tonguefish Tope Topminnow Torpedo Torrent-catfish Torrent-fish Trahira Treefish Trevally Triggerfish Triplefin-blenny Triplespine Tripletail Tripod-fish Trout Trout-cod Trout-perch Trumpeter Trumpetfish Trunkfish Tubeblenny Tube-eye Tube-snout Tubeshoulder Tui-chub Tuna Turbot Two-spotted-goby Uaru Unicorn-fish Upside-down-catfish Vanjaram Velvet-belly-lanternshark Velvet-catfish Velvetfish Vendace Vermilion-snapper Vimba Viperfish Wahoo Walking-catfish Wallago Walleye Walleye-pollock Walu Warmouth Warty-angler Waryfish Waspfish Weasel-shark Weatherfish Weever Weeverfish Wels-catfish Whale-catfish Whalefish Whale-shark Whiff Whitebait White-croaker Whitefish White-marlin White-shark Whitetip-reef-shark Whiting Wobbegong Wolf-eel Wolffish Wolf-herring Worm-eel Wormfish Wrasse Wrymouth X-ray-tetra Yellow-and-black-triplefin Yellowback-fusilier Yellowbanded-perch Yellow-bass Yellowedge-grouper Yellow-edged-moray Yellow-eye-mullet Yellowhead-jawfish Yellowfin-croaker Yellowfin-cutthroat-trout Yellowfin-grouper Yellowfin-tuna Yellowfin-pike Yellowfin-surgeonfish Yellowfin-tuna Yellow-jack Yellowmargin-triggerfish Yellow-moray Yellow-perch Yellowtail Yellowtail-amberjack Yellowtail-barracuda Yellowtail-clownfish Yellowtail-horse-mackerel Yellowtail-kingfish Yellowtail-snapper Yellow-tang Yellow-weaver Yellowtail-catfish Zander Zebra-bullhead-shark Zebra-danio Zebrafish Zebra-lionfish Zebra-loach Zebra-oto Zebra-pleco Zebra-shark Zebra-tilapia Zebra-turkeyfish Ziege Zingel \
";
    doStuff3();
    return false;
}

function doCapitals() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
";
    doStuff3();
    return false;
}

function doTemplate() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
    Abu-Dhabi Abuja Accra Addis-Ababa Algiers Amman Amsterdam Andorra-la-Vella Ankara Antananarivo Apia Ashgabat Asmara Asuncion Athens Baghdad Baku Bamako Bandar-Seri-Begawan Bangkok Bangui Banjul Basseterre Beijing Beirut Belfast Belgrade Belmopan Berlin Bern Bishkek Bissau Bogota Brasilia Bratislava Brazzaville Bridgetown Brussels Bucharest Budapest Buenos-Aires Cairo Canberra Caracas Cardiff Castries Chisinau Colombo Conakry Copenhagen Dakar Damascus Dhaka Dili Djibouti Dodoma Doha Dublin Dushanbe Edinburgh Freetown Funafuti Gaborone Georgetown Gitega Guatemala-City Hanoi Harare Havana Helsinki Honiara Islamabad Jakarta Jerusalem Juba Kabul Kampala Kathmandu Khartoum Kiev Kigali Kingston Kingstown Kinshasa Kuala-Lumpur Kuwait-City La-Paz Libreville Lilongwe Lima Lisbon Ljubljana Lome London Luanda Lusaka Luxembourg Madrid Majuro Malabo Male Managua Manama Manila Maputo Maseru Mbabana Melekeok Mexico-City Minsk Mogadishu Monaco Monrovia Montevideo Moroni Moscow Muscat NDjamena Nairobi Nassau Nay-Pyi-Taw New-Delhi Niamey Nicosia Nouakchott Nukualofa Nur-Sultan Oslo Ottawa Ouagadougou Palikir Panama-City Paramaribo Paris Phnom-Penh Podgorica Port-au-Prince Port-Louis Port-Moresby Port-of-Spain Port-Vila Porto-Novo Prague Praia Pretoria Pristina Pyongyang Quito Rabat Reykjavik Riga Riyadh Rome Roseau Saint-Georges Saint-Johns San-Jose San-Marino San-Salvador Sanaa Santiago Santo-Domingo Sao-Tome Sarajevo Seoul Singapore Skopje Sofia Stockholm Suva Taipei Tallinn Tarawa-Atoll Tashkent Tbilisi Tegucigalpa Tehran Thimphu Tirana Tokyo Tripoli Tunis Ulaanbaatar Vaduz Valletta Vatican-City Victoria Vienna Vientiane Vilnius Warsaw Washington Wellington Windhoek Yamoussoukro Yaounde Yerevan Zagreb\
";
    doStuff3();
    return false;
}

