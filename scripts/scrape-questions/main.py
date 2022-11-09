import requests
from bs4 import BeautifulSoup as bs
import unicodedata
import json

url = "https://bishalsarang.github.io/Leetcode-Questions/out.html"

html_text = requests.get(url).text

soup = bs(html_text, 'html.parser')

titles = soup.find_all(id="title")

result = []

for title in titles:
  title_string = str(title.string).split('. ')[1]

  # Find the content of this questions
  content = title.find_next_sibling().findChild()
  clean_content = str(content).replace('\n', '<br/>')
  clean_content = clean_content.replace('"', "'")
  normalized_content = unicodedata.normalize('NFKD', clean_content)

  result.append({
    'title': unicodedata.normalize('NFKD', title_string),
    'description': normalized_content
  })

# Retrieve the outfile as json file to dump into mongodb
with open("questions.json", "w") as outfile:
  json.dump(result, outfile)
