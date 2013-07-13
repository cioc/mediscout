import json
import re

with open('data/hospitals_w_matches.json', 'r') as f:
  with open('sql/hospitals_queries.sql', 'w+') as g:
    for l in f:
      o = json.loads(l)
      query = "INSERT INTO hospitals (fed_id, name, fed_name, lat, lng, neighborhood, addr, city, state, zip) VALUES "
      query += "(%d, '%s', '%s', %f, %f, '%s', '%s', '%s', '%s', '%s');" % (o['fed_id'], re.escape(o['name']), re.escape(o['fed_name']), o['lat'], o['lng'], o['neighborhood'], o['addr'], o['city'], o['state'], o['zip'])
      g.write(query+'\n') 
