import json
import re

with open('data/costs_inpatient.json', 'r') as f:
  with open('sql/costsQueriesInpatient.sql', 'w+') as g:
    for l in f:
      o = json.loads(l) 
      query = "INSERT INTO costs (fed_id, fed_proc_id, billed, paid) VALUES "
      query += "(%d, '%s', %f, %f);" % (o['fed_id'], re.escape(o['proc_id']), o['billed'], o['paid'])
      g.write(query+'\n') 
