from pykml import parser
import json

with open('original_data/kmlHospitals.kml', 'r') as f:
  doc = parser.parse(f)

with open('data/hospitals.json', 'w+') as g:
  for i in doc.iter():
    if len(i.getchildren()) == 4:
        l = list(i.iter())
        if (len(l) == 8):
          print l
          name = str(l[1])
          print name
          print str(l[7])
          pos = map(lambda x: float(x), str(l[7]).split(','))        
          o = {"name": name, "lng": pos[0], "lat": pos[1]}
          g.write(json.dumps(o)+'\n')

