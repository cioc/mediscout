import json
import re

with open('data/procedures_outpatient.json', 'r') as f:
  with open('sql/proceduresQueriesOutpatient.sql', 'w+') as g:
    for l in f:
      print "1"
      o = json.loads(l) 
      query = "INSERT INTO procedures (fed_proc_id, proc_type, name, options) VALUES "
      query += "('%s', '%s', '%s', '%s');" % (re.escape(o['id']), re.escape(o['type']), re.escape(o['name']), re.escape(o['options']))
      g.write(query+'\n')  

