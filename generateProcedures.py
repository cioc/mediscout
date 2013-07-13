import json
import csv

print "Loading Federal Data..."
procedures = {}
procedure_type = 'outpatient'
with open('original_data/Medicare_Provider_Charge_Outpatient_APC30_CY2011.csv', 'rb') as f:
  reader = csv.reader(f, delimiter=',', quotechar='"')
  rowCount = 0
  for row in reader:
    if rowCount > 0:
      pieces = row[0].split('-')
      p_id = pieces[0].strip()
      p_name = pieces[1].strip() 
      p_type = procedure_type
      if p_id not in procedures:
        procedures[p_id] = (p_name, p_type)
    rowCount += 1
print rowCount
with open('data/procedures_'+procedure_type+'.json', 'w+') as g:
  for p_id in procedures:
    p_name, p_type = procedures[p_id]
    o = {}
    o['id'] = p_id
    o['name'] = p_name
    o['type'] = p_type
    g.write(json.dumps(o)+'\n') 

