#!/usr/bin/env python
import sys
import requests

url = "https://translate.google.com/"
cc = [
		{"code":"af","name":"afrikaans"},
		{"code":"sq","name":"albanian"},
		{"code":"ar","name":"arabic"},
		{"code":"hy","name":"armenian"},
		{"code":"az","name":"azerbaijani"},
		{"code":"eu","name":"basque"},
		{"code":"be","name":"belarusian"},
		{"code":"bn","name":"bengali"},
		{"code":"bs","name":"bosnian"},
		{"code":"bg","name":"bulgarian"},
		{"code":"ca","name":"catalan"},
		{"code":"ceb","name":"cebuano"},
		{"code":"zh-CN","name":"chinese"},
		{"code":"hr","name":"croatian"},
		{"code":"cs","name":"czech"},
		{"code":"da","name":"danish"},
		{"code":"nl","name":"dutch"},
		{"code":"en","name":"english"},
		{"code":"eo","name":"esperanto"},
		{"code":"et","name":"estonian"},
		{"code":"tl","name":"filipino"},
		{"code":"fi","name":"finnish"},
		{"code":"fr","name":"french"},
		{"code":"gl","name":"galician"},
		{"code":"ka","name":"georgian"},
		{"code":"de","name":"german"},
		{"code":"el","name":"greek"},
		{"code":"gu","name":"gujarati"},
		{"code":"ht","name":"haitian creole"},
		{"code":"ha","name":"hausa"},
		{"code":"iw","name":"hebrew"},
		{"code":"hi","name":"hindi"},
		{"code":"hmn","name":"hmong"},
		{"code":"hu","name":"hungarian"},
		{"code":"is","name":"icelandic"},
		{"code":"ig","name":"igbo"},
		{"code":"id","name":"indonesian"},
		{"code":"ga","name":"irish"},
		{"code":"it","name":"italian"},
		{"code":"ja","name":"japanese"},
		{"code":"jw","name":"javanese"},
		{"code":"kn","name":"kannada"},
		{"code":"km","name":"khmer"},
		{"code":"ko","name":"korean"},
		{"code":"lo","name":"lao"},
		{"code":"la","name":"latin"},
		{"code":"lv","name":"latvian"},
		{"code":"lt","name":"lithuanian"},
		{"code":"mk","name":"macedonian"},
		{"code":"ms","name":"malay"},
		{"code":"mt","name":"maltese"},
		{"code":"mi","name":"maori"},
		{"code":"mr","name":"marathi"},
		{"code":"mn","name":"mongolian"},
		{"code":"ne","name":"nepali"},
		{"code":"no","name":"norwegian"},
		{"code":"fa","name":"persian"},
		{"code":"pl","name":"polish"},
		{"code":"pt","name":"portuguese"},
		{"code":"pa","name":"punjabi"},
		{"code":"ro","name":"romanian"},
		{"code":"ru","name":"russian"},
		{"code":"sr","name":"serbian"},
		{"code":"sk","name":"slovak"},
		{"code":"sl","name":"slovenian"},
		{"code":"so","name":"somali"},
		{"code":"es","name":"spanish"},
		{"code":"sw","name":"swahili"},
		{"code":"sv","name":"swedish"},
		{"code":"ta","name":"tamil"},
		{"code":"te","name":"telugu"},
		{"code":"th","name":"thai"},
		{"code":"tr","name":"turkish"},
		{"code":"uk","name":"ukrainian"},
		{"code":"ur","name":"urdu"},
		{"code":"vi","name":"vietnamese"},
		{"code":"cy","name":"welsh"},
		{"code":"yi","name":"yiddish"},
		{"code":"yo","name":"yoruba"},
		{"code":"zu","name":"zulu"}
	]

if len(sys.argv) < 4:
	print "Usage:\ntranslate.py <source language> <new language> <text>"
	exit()
sl = tl = ""
for i in range(0,len(cc)):
	if sys.argv[1].lower() == cc[i]["name"]:
		sl = cc[i]["code"]
	if sys.argv[2].lower() == cc[i]["name"]:
		tl = cc[i]["code"]

text = " ".join(sys.argv[3::])
options = {
	"sl":sl,
	"tl":tl,
	"js":"n",
	"prev":"_t",
	"hl":sl,
	"ie":"UTF-8",
	"text":text,
	"file":"",
	"edit-text":""
	}

r = requests.post(url,data=options)
s = r.text.find("TRANSLATED_TEXT")+len("TRANSLATED_TEXT='")
e = r.text[s::].find("';")+s
print r.text[s:e]