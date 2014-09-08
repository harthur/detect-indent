import sys
import time
import csv

class AddressesFinder:
    def __init__(self, addresses):
        self.addresses = addresses

    def call(self):
        output = []
        for idx, address in enumerate(self.addresses):
            if idx in sum(output, []):
                continue
            similars = self.search_similarities(address)
            output.append(similars)
        return output

    def similar(self, str1, str2):
        return str1.lower().strip() == str2.lower().strip()

    def search_similarities(self, str):
        i = 0
        output = []
        for address in self.addresses:
            if self.similar(str, address):
                output.append(i)
            i+=1
        return output


class Storer(object):
    def __init__(self, filename):
        self.filename = filename
        self.output = []
        self.full_ans = []
        self.populate()

    def store(self, ans, group):
        ans_group = str([ans, group]) + "\n"
        with open(self.filename, "a") as myfile:
            myfile.write(ans_group)

    def asked(self):
        return self.output

    def populate(self):
        try:
            with open(self.filename, "r") as myfile:
                for line in myfile:
                    self.full_ans.append(eval(line))
                    self.output.append(eval(line)[1])
        except IOError:
            self.output = []


class Question:
    def __init__(self, csv_info, arr):
        self.storer = Storer('ans.bk')
        self.csv_info = csv_info
        self.arr = arr

    def already_asked(self):
        flatten = sum(self.storer.asked(), [])
        return self.arr[0] in flatten

    def ask(self):
        if len(self.arr) > 1:
            question_str = "\n".join([self.text(index) for index in self.arr])
            print question_str
            return self.check_ans(raw_input("Select the main one [Number or 'n' for (none)]: "))
        return self.arr[0]

    def check_ans(self, ans):
        if ans != 'n':
            try:
                ans = int(ans)
            except ValueError:
                self.show_error()
            if ans not in self.arr:
                self.show_error()
        return ans

    def show_error(self):
        print "Error, please retry!"
        self.ask()

    def text(self, index):
        row = self.csv_info[index]
        return """
            ID: %s
            Full name': %s
            Provider': %s
            Member of': %s
            Address: %s
            """ % (index, self._full_name(row), row[6], row[8], row[10])

    def _full_name(self, row):
        return "%s %s %s" % (row[2], row[3], row[4])


class DataHandler:
    def __init__(self, filename):
        self.filename = filename
        self.rows = []
        self.titles = []
        self.populate()

    def populate(self):
        with open(self.filename, 'r') as myfile:
            reader = csv.reader(myfile)
            for line in reader:
                self.rows.append(line)
        self.titles = self.rows[0]
        del self.rows[0] # Remove titles

    def column_at(self, index):
        return [row[index] for row in self.rows]


class Generator():
    def __init__(self, filename):
        self.filename = filename
        self.data_handler = DataHandler(filename)
        self.output = []
        self.output_filename = self.gen_output_filename()

    def call(self):
        self.aggregate()
        self.generate_csv()

    def aggregate(self):
        for ans in Storer('ans.bk').full_ans:
            if ans[0] == 'n':
                print "%s should be added manually" % ', '.join([str(x) for x in ans[1]])
            else:
                count = 1
                if len(ans) > 1:
                    count = len(ans[1])
                self.output.append(self.data_handler.rows[ans[0]] + [count])

    def gen_output_filename(self):
        return str(int(time.time())) + '.csv'

    def generate_csv(self):
        with open(self.output_filename, 'wb') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerow(self.titles())
            for row in self.output:
                csv_writer.writerow(row)
        print "Check %s" % self.output_filename

    def titles(self):
        return self.data_handler.titles + ['count']


def ask(filename):
    data_handler = DataHandler(filename)
    addresses = data_handler.column_at(10)
    addresses_finder = AddressesFinder(addresses)
    groups = addresses_finder.call()
    storer = Storer('ans.bk')

    for group in groups:
        question = Question(data_handler.rows, group)
        if not question.already_asked():
            storer.store(question.ask(), group)


def generate(filename):
    Generator(filename).call()


if __name__ == "__main__":
    if sys.argv[1] == 'extract':
        ask(sys.argv[2])
    elif sys.argv[1] == 'generate':
        generate(sys.argv[2])
    else:
        print "extract or generate\n"

