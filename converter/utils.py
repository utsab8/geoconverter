import csv
import xml.etree.ElementTree as ET
from io import StringIO, BytesIO

def kml_to_csv(kml_file):
    try:
        tree = ET.parse(kml_file)
        root = tree.getroot()
        ns = {'kml': 'http://www.opengis.net/kml/2.2'}
        placemarks = root.findall('.//kml:Placemark', ns)
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['Name', 'Description', 'Longitude', 'Latitude'])
        for pm in placemarks:
            name = pm.find('kml:name', ns)
            desc = pm.find('kml:description', ns)
            coords = pm.find('.//kml:coordinates', ns)
            if coords is not None:
                coord_text = coords.text.strip()
                lon, lat, *_ = coord_text.split(',')
            else:
                lon, lat = '', ''
            writer.writerow([
                name.text if name is not None else '',
                desc.text if desc is not None else '',
                lon, lat
            ])
        output.seek(0)
        return output
    except Exception as e:
        raise ValueError(f"Invalid KML file: {e}")

def csv_to_kml(csv_file):
    try:
        csv_file.seek(0)
        reader = csv.DictReader(StringIO(csv_file.read().decode('utf-8')))
        kml = ET.Element('kml', xmlns='http://www.opengis.net/kml/2.2')
        doc = ET.SubElement(kml, 'Document')
        for row in reader:
            pm = ET.SubElement(doc, 'Placemark')
            name = ET.SubElement(pm, 'name')
            name.text = row.get('Name', '')
            desc = ET.SubElement(pm, 'description')
            desc.text = row.get('Description', '')
            point = ET.SubElement(pm, 'Point')
            coords = ET.SubElement(point, 'coordinates')
            coords.text = f"{row.get('Longitude', '')},{row.get('Latitude', '')},0"
        kml_bytes = BytesIO()
        ET.ElementTree(kml).write(kml_bytes, encoding='utf-8', xml_declaration=True)
        kml_bytes.seek(0)
        return kml_bytes
    except Exception as e:
        raise ValueError(f"Invalid CSV file: {e}") 