import requests
import shutil
import sys

HOST = 'http://rtex.probablyaweb.site'

# Get LaTeX code from stdin
LATEX = sys.argv[1]

# Submit POST request to rTeX
payload = {'code': LATEX, 'format': 'png'}
response = requests.post('http://rtex.probablyaweb.site/api/v2', data = payload)
response.raise_for_status()
jdata = response.json()
if jdata['status'] != 'success':
	raise Exception('Failed to render LaTeX')

# Return link to resource on stdout
url = HOST + '/api/v2/' + jdata['filename']

sys.stdout.write(url)
