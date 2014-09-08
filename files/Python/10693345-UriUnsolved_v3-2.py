import urllib3
import time
from lxml import etree
import pickle
import sys
from random import randint
import random
import os

from Queue import Queue
from threading import Thread

NUM_SOCKETS = 3
NUM_WORKERS = 5

def save_obj(obj, name):
  with open('obj/'+name+'.pkl','wb') as f:
    pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'r') as f:
        return pickle.load(f)

def load_prune(name ):
    with open(name, 'r') as f:
        return pickle.load(f)
pessoas = {
  'Gust': '6238',
  'Edson': '2951',
  'Matheus Faria': '3732',
  'Arthur': '3426',
  'Kanashiro': '14824',
  'Guilherme Lima': '15619',
  'Alexandre': '3421',
  'David': '15451'
}

solved_exs = {}
uri_exs = {}
uri_lvs = {}

all_ex = {}


isFinished = False
http = urllib3.PoolManager(maxsize=NUM_SOCKETS)

class ThreadPool:
    """Pool of threads consuming tasks from a queue"""
    def __init__(self, num_threads):
        self.tasks = Queue(num_threads)
        for _ in range(num_threads): Worker(self.tasks)

    def add_task(self, func, *args, **kargs):
        """Add a task to the queue"""
        self.tasks.put((func, args, kargs))

    def wait_completion(self):
        """Wait for completion of all the tasks in the queue"""
        self.tasks.join()

class Worker(Thread):
    """Thread executing tasks from a given tasks queue"""
    def __init__(self, tasks):
        Thread.__init__(self)
        self.tasks = tasks
        self.daemon = True
        self.start()
    
    def run(self):
        while True:
            func, args, kargs = self.tasks.get()
            try: func(*args, **kargs)
            except Exception, e: print e
            self.tasks.task_done()
      # self.url = url
      # self.state = state
      # self.aluno = aluno

def proc_questions(url, state=1, aluno=None):
  """Processa questoes"""

  global isFinished
  if isFinished:
    return

  r = http.request('GET', url)
  html = etree.HTML(r.data)
  tr_nodes = html.xpath('//div[@id="element"]/table/tbody')
  if len(tr_nodes) <= 0:
    isFinished = True
    print "Pagina nao existente processada."
    return

  content_nodes = tr_nodes[0].xpath("tr")
  header = [i[0][0].text for i in tr_nodes[0].xpath("tr") if len(i) > 1]
  name = [i[2][0].text for i in tr_nodes[0].xpath("tr") if len(i) > 1]
  classe = [i[3][0].text for i in tr_nodes[0].xpath("tr") if len(i) > 1]
  solved = [i[4].text for i in tr_nodes[0].xpath("tr") if len(i) > 1]
  level = [i[5].text for i in tr_nodes[0].xpath("tr") if len(i) > 1]

  for i, head in enumerate(header):
    uri_exs[head] = []
    uri_exs[head].append(level[i])
    uri_exs[head].append(solved[i])
    uri_exs[head].append(name[i])
    uri_exs[head].append(classe[i])
  time.sleep(1)
  print "Done: ", url
  

def proc_solved(url, state=1, aluno=None):
  """Processa exercicios de alunos"""
  global isFinished
  global solved_exs
  if isFinished:
    return

  r = http.request('GET', url)
  html = etree.HTML(r.data)
  tr_nodes = html.xpath('//div[@id="element"]/table/tbody')

  if len(tr_nodes) <= 0:
    print "Aluno("+aluno+") processado."
    isFinished = True
    print "Pagina nao existente processada."
    return

  content_nodes = tr_nodes[0].xpath("tr")
  header = [i[0][0].text for i in tr_nodes[0].xpath("tr") if len(i) > 1]
  for ex in header:
    if aluno in solved_exs:
      if not ex in solved_exs[aluno]:
        solved_exs[aluno].append(ex) 
    else:
      solved_exs[aluno] = [ex]

  time.sleep(1)
  print "Done: ", url


    # def run(self):
    #     global isFinished
    #     if isFinished:
    #       return
    #     if self.state == 1:
    #       self.proc_questions()
    #     else:
    #       self.proc_solved()

def process_link_aluno(link, aluno):  
  """Processa o link do aluno para exs resolvidos"""
  global pool
  args = (link,2,aluno)
  pool.add_task(proc_solved, *args  )


def process_aluno(aluno, pagenum=999):
  global solved_exs
  global pessoas
  global pool
  global isFinished

  pool = ThreadPool(NUM_WORKERS)
  #pool = workerpool.WorkerPool(size=NUM_WORKERS)

  #Se existir, pega, e apenda conteudos novos
  try:
    solved_exs = load_obj('solved_exsv2')
  except:
    if not os.path.exists("obj"):
      print "Creating dir obj"
      os.mkdir("obj")
    print "uri_exsv2 nao encontrado, criando /obj/solved_exsv2"
  
  if not aluno in pessoas:
    print "Aluno nao registrado"
    return

  print "Processando " + aluno
  page = 1
  while True:
    link = "http://www.urionlinejudge.com.br/judge/en/profile/"+pessoas[aluno]+"/sort:Run.updatetime/direction:desc/page:"+str(page)
    process_link_aluno(link, aluno)
    if isFinished:
      break
    page+=1
    if page > pagenum:
      break;

  pool.wait_completion()

  save_obj(solved_exs, 'solved_exsv2')

def process_solved_exs(pagenum=999):
  global solved_exs
  global pool
  global isFinished

  #Se existir, pega, e apenda conteudos novos
  try:
    solved_exs = load_obj('solved_exsv2')
  except:
    if not os.path.exists("obj"):
      print "Creating dir obj"
      os.mkdir("obj")
    print "uri_exsv2 nao encontrado, criando /obj/solved_exsv2"

  for aluno in pessoas.items():
    pool = ThreadPool(NUM_WORKERS)
    isFinished = False
    page = 1
    solved_exs[aluno[0] ] = []
    print "Processando " + aluno[0]
    while True:
      link = "http://www.urionlinejudge.com.br/judge/en/profile/"+aluno[1]+"/sort:Run.updatetime/direction:desc/page:"+str(page)
      process_link_aluno(link, aluno[0])
      
      if isFinished:
        break

      page+=1
      if page > pagenum:
        break
    pool.wait_completion()

  save_obj(solved_exs, 'solved_exsv2')

def sort_lv():
  return sorted(uri_exs.items(), key=lambda e: e[1][0])

def filter_lv(level):
  global uri_exs
  return dict((k, v) for (k, v) in uri_exs.iteritems() if int(v[0]) == int(level) )

def print_ex(i):
  global uri_exs
  print "-----------------------------"
  print "Ex("+i+"): " + uri_exs[i][2] 
  print "Solved: " + uri_exs[i][1]
  print "Level: " + uri_exs[i][0]
  print "Categoria: " + uri_exs[i][3]
  #print "-----------------------------"

        
#Parse com:
# Key: numero do ex
#0 level
#1 solved
#2 nome
#3 categoria
def parse_exs(npages = 99, startPage = 1, once = False):
  page = startPage
  endPage = page+npages
  pool = ThreadPool(NUM_WORKERS)
  global uri_exs
  
  #Se existir, pega, e apenda conteudos novos
  try:
    uri_exs = load_obj('uri_exsv2')
  except:
    if not os.path.exists("obj"):
      print "Creating dir obj"
      os.mkdir("obj")
    print "uri_exsv2 nao encontrado, criando /obj/uri_exsv2"
    

  while(True):
    link = "http://www.urionlinejudge.com.br/judge/en/problems/all/sort:id/direction:desc/page:"+str(page)
    
    pool.add_task(proc_questions, link  )
    
    #get all tr
    if(once): 
      break

    page+=1

    if page >= endPage:
      break

  pool.wait_completion()
  save_obj(uri_exs, 'uri_exsv2')


def generateExs(lv = 0, number = 1):
  global uri_exs
  global solved_exs
  global pessoas
  global all_ex
  uri_exs = load_obj('uri_exsv2')
  solved_exs = load_obj('solved_exsv2')
  print 'Generating '+ str(number)

  #conta exs iguais
  all_ex = {}
  for i, aluno in enumerate(pessoas.iteritems()):
    for key in solved_exs[aluno[0] ]:
      #print key, "|", aluno[0]
      if key in all_ex:
        all_ex[key] += 1
      else:
        all_ex[key] = 1

#lista todos que nao todos fizeram ou que todos fizeram ==
  # all_ppl = len(pessoas.items())
  # all_ex = dict((k, v) for (k, v) in all_ex.iteritems() if v != all_ppl)
  
  #pega somente keys que todos tenham
#  for (k, v) in all_ex.iteritems():
#    print k, " | ", v

  uri = uri_exs
  if(lv > 0):
    uri = filter_lv(lv)

  if len(uri) <= 0:
    print "Nenhum ex econtrado do lv."
    raise SystemExit
  else:
    print str(len(uri)) + " ex do lv", lv, "econtrado(s)."

  #filtra todos os elementos que nao estao na lista
  all_ex = dict((k, v) for (k, v) in uri.iteritems() if not k in all_ex)

  if len(uri) <= 0:
    print "Nenhum ex econtrado."
    raise SystemExit
  else:
    print str(len(all_ex)) + " ex inedido para todos econtrado(s)."

  # if number > len(all_ex):
  #   number = len(all_ex)
  # #Gera random nao-repetido
  # lista = random.sample(xrange(0,len(all_ex)), number)  

  # for ex_id in lista:
  #   print_ex( uri.keys()[ ex_id ] )

def printRandomEx(number = 1):
  global all_ex
  global uri_exs
  if number > len(all_ex):
    number = len(all_ex)
  #Gera random nao-repetido
  lista = random.sample(xrange(0,len(all_ex)), number)  

  # print uri_exs[ all_ex.keys()[lista[1] ] ]

  for ex_id in lista:
    print_ex( all_ex.keys()[ex_id]  )

  # for ex_id in lista:
  #   print_ex( uri_exs.keys()[ ex_id ] )

def printAllUncomonEx():#filter_lv = 0
  global all_ex
  # a = None
  # if filter != 0:
  #   a = dict((k, v) for (k, v) in uri_exs.iteritems() if int(v[0]) == int(filter_lv) )
  
  # sort solved decresent
  #all_ex = sorted(all_ex.items(), key=lambda e: int(e[1][1]), reverse=True )

  all_ex = sorted(all_ex.items(), key=lambda e: ( int(e[1][0]), int(e[1][1]) ), reverse=True )
  for i in all_ex:
    print i

def printPrettyAllUncomonEx():#filter_lv = 0
  global all_ex
  global uri_exs
  
  all_ex = sorted(all_ex.items(), key=lambda e: ( int(e[1][0]), int(e[1][1]) ), reverse=True )
  for i in all_ex:
    print_ex( i[0] )

def listDiff(nameA, nameB, lv=0, pretty=False):
  """Mostra exs diferentes """
  global uri_exs
  global solved_exs
  global pessoas
  global all_ex
  uri_exs = load_obj('uri_exsv2')
  solved_exs = load_obj('solved_exsv2')
  print 'Checking... '

  all_ex = {}
  
  for key in solved_exs[nameB]:
    if key in all_ex:
      all_ex[key] += 1
    else:
      all_ex[key] = 1
  for key in solved_exs[nameA]:
    if key in all_ex:
      del all_ex[key]

  uri = uri_exs
  if(lv > 0):
    uri = filter_lv(lv)

  if len(uri) <= 0:
    print "Nenhum ex econtrado do lv."
    raise SystemExit
  else:
    print str(len(uri)) + " ex do lv", lv, "econtrado(s)."

  #filtra todos os elementos que nao estao na lista
  all_ex = dict((k, v) for (k, v) in uri.iteritems() if k in all_ex)

  if len(uri) <= 0:
    print "Nenhum ex econtrado."
    raise SystemExit
  else:
    print str(len(all_ex)) + " ex que {0} nao fez.".format(nameA)

  if not pretty:
    for i in all_ex.iteritems():
      print i
  else:
    for i in all_ex.keys():
      print_ex( i )

def listPessoas(state=0):
  """Lista pessoas e seus ranks"""
  global solved_exs
  global pessoas
  global all_ex
  global uri_exs
  uri_exs = load_obj('uri_exsv2')
  solved_exs = load_obj('solved_exsv2')

  p = sorted(solved_exs.items(), key=lambda e: len(e[1]), reverse=True )
  for i in p: 
    print '{0: <20} | {1: >3}'.format(i[0], len(i[1]))
    if state != 0:
      for l in range(1,10):
        a = [v for (k,v) in uri_exs.iteritems() if k in i[1] and v[0] == str(l) ]
        if state == 1:
          print '  level {0}: {1: <3}'.format(l, len(a) )
        if state == 2:
          b = [v for (k,v) in uri_exs.iteritems() if v[0] == str(l) ]
          print '  level {0}: {1: <3} / {2} '.format(l, len(a), len(b) )





if __name__ == "__main__":
  try:
    if len(sys.argv) > 1:
      if sys.argv[1] == 'update':
        number = 999
        if len(sys.argv) > 2:
          number = int(sys.argv[2])

        process_solved_exs(number)
      
      elif sys.argv[1] == 'updatename':
        if len(sys.argv) <= 2:
          print "Falta nome do aluno"
          raise SystemExit
        number = 999
        if len(sys.argv) > 3:
          number = int(sys.argv[3])

        process_aluno(sys.argv[2], number)

      elif sys.argv[1] == 'questions':
        number = 99
        if len(sys.argv) > 2:
          number = int(sys.argv[2])
        parse_exs(number)
      
      elif sys.argv[1] == 'question':
        number = 1
        if len(sys.argv) > 2:
          number = int(sys.argv[2])
        parse_exs(1, number, True)
      
      elif sys.argv[1] == 'ex':
        lv = 0
        number = 1
        if len(sys.argv) > 2:
          lv = int(sys.argv[2])
        if len(sys.argv) > 3:
          number = int(sys.argv[3])
        generateExs(lv, number)
        printRandomEx(number)

      elif sys.argv[1] == 'listex':
        lv = 0
        if len(sys.argv) > 2:
          lv = int(sys.argv[2])
        generateExs(lv, 9999)
        printAllUncomonEx()

      elif sys.argv[1] == 'listex2':
        lv = 0
        if len(sys.argv) > 2:
          lv = int(sys.argv[2])
        generateExs(lv, 9999)
        printPrettyAllUncomonEx()

      elif sys.argv[1] == 'diff':
        #A nao fez de B
        if len(sys.argv) < 3:
          print "Uso: NomeA NomeB <filterlv> <pretty>"
          raise SystemExit
        lv = 0
        pretty = False
        if len(sys.argv) > 4:
          lv = int(sys.argv[4])
        if len(sys.argv) > 5:
          pretty = bool(sys.argv[5])

        listDiff(sys.argv[2], sys.argv[3], lv, pretty)
      elif sys.argv[1] == 'list':
        state = 0
        if len(sys.argv) > 2:
          state = int(sys.argv[2])
        listPessoas(state)

      elif sys.argv[1] == 'same':
        print "not yet"
    else:
      print "Nenhum parametro: "
      print "ex lv number \n\t=> Lista exs nao feitos por nenhum membro, especificado lv e numeros mostrados" 
      print "listex, listex2 \n\t=> Lista todos os exs feitos por nenhum membro, diferenca apenas no formato"
      print "update <n_pages> \n\t=> Atualiza questoes feitas, n_pages para atualizar somente <n_pages> mais recentes"
      print "updatename nome <n_pages> \n\t=> Atualiza questoes somente da pessoa"
      print "questions numero_pg \n\t=> Atualiza exercicios do URI, n_pages pra atualizar <n_pages> mais recentes"
      print "diff nameA nameB <lv> <pretty> \n\t=> Mostra exercicios que B fez e A nao"
      print "list type(0,1,2) \n\t=> Lista ranking e exercicios feitos por nivel, type para formatacao"
      print "depreceated: question numero_pg"
      #print_exs()
  except KeyboardInterrupt:
    print "Stopping (KeyboardInterrupt)"
    sys.exit()