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
    document.getElementById("newwords").innerHTML = "";
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
        // output
        document.getElementById("newwords").innerHTML += newWord + " ";
    }

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

function doTemplate() {
    document.getElementById("newwords").innerHTML = "";
    document.getElementById("theCorpus").value = "\
";
    doStuff3();
    return false;
}

