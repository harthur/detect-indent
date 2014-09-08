import re

class Tweet:

  def __init__(self, attributes):
    self.attributes = attributes
    self.id = attributes['id']
    self.raw_text = attributes['text']
    self.just_text = self.just_text()
    self.is_mention = self.is_mention()
    self.author = attributes['user']['screen_name']

  def just_text(self):
    return re.sub(r'^(@\w+\s)+', '', self.raw_text)

  def is_mention(self):
    return not not self.attributes['entities']['user_mentions']