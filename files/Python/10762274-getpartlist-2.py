#coding:utf-8
import MeCab

s="私はみかんが好きです。"

partlist=[] #品詞リスト

result=MeCab.Tagger('mecabrc').parse(s).replace("EOS","\\")
i=result.index("\t")
while result[i]!='\\':
  partname=''
  while result[i]!='\t':
    i+=1
  i+=1
  while result[i]!=",":
    partname+=result[i]
    i+=1
  while result[i]!="\n":
    i+=1
  i+=1
  partlist.append(partname)

for r in partlist:
  print r