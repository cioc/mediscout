import json
import csv
import difflib

print "Loading Federal Data..."
hospital_lookup = {}
with open('original_data/Medicare_Provider_Charge_Outpatient_APC30_CY2011.csv', 'rb') as f:
  reader = csv.reader(f, delimiter=',', quotechar='"')
  rowCount = 0
  for row in reader:
    if rowCount > 0:
      hid = int(row[1])
      name = str(row[2])
      if hid not in hospital_lookup:
        hospital_lookup[hid] = (name, row)
    rowCount += 1
print rowCount
print len(hospital_lookup) 

print "Loading Chicago Data"
chicago_hospitals = []
with open('data/hospitals.json', 'r') as f:
  for l in f:
    chicago_hospitals.append(json.loads(l))
print len(chicago_hospitals)

print "Matching hospitals..."
with open('data/matches.json', 'w+') as g:
  i = 0
  for ch in chicago_hospitals:
    print "Matching %d\n" % (i)
    i += 1
    candidate_distance = None
    candidate_name = None
    candidate_id = None
    candidate_row = None
    for k in hospital_lookup:
      name, row = hospital_lookup[k]
      v = difflib.SequenceMatcher(lambda x: x in ' \t', ch['name'].lower(),name.lower()).ratio()
      if (candidate_distance is None or candidate_distance < v) and (row[5] == "IL"):
        candidate_distance = v
        candidate_name = name
        candidate_id = k
        candidate_row = row
    if candidate_row is not None:
      o = {}
      o['name'] = ch['name']
      o['fed_name'] = candidate_name
      o['fed_id'] = candidate_id
      o['addr'] = candidate_row[3]
      o['city'] = candidate_row[4]
      o['state'] = candidate_row[5]
      o['zip'] = candidate_row[6]
      o["lng"] = ch["lng"]
      o["lat"] = ch["lat"]
      g.write(json.dumps(o)+'\n')

