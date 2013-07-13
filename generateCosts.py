import json
import csv

print "Loading Hospitals"
hospital_ids = []
with open('data/hospitals_w_matches.json', 'r') as g:
  for l in g:
    o = json.loads(l)
    hospital_ids.append(o['fed_id']) 

print "Loading Federal Data..."

procedure_type = 'outpatient'
with open('original_data/Medicare_Provider_Charge_Outpatient_APC30_CY2011.csv', 'rb') as f:
  with open('data/costs_'+procedure_type+'.json', 'w+') as g:
    reader = csv.reader(f, delimiter=',', quotechar='"')
    rowCount = 0
    for row in reader:
      if rowCount > 0:
        pieces = row[0].split('-')
        p_id = pieces[0].strip()
        p_name = pieces[1].strip() 
        p_type = procedure_type
        if int(row[1]) in hospital_ids:
          o = {}
          o['fed_id'] = int(row[1])
          o['proc_id'] = p_id
          o['billed'] = float(row[9])
          o['paid'] = float(row[10])
          g.write(json.dumps(o)+'\n')        
      rowCount += 1

