import requests
import shutil
import sys

HOST = 'http://rtex.probablyaweb.site'

LATEX = sys.argv[1]

def download_file(url, dest_filename):
	response = requests.get(url, stream = True)
	response.raise_for_status()
	with open(dest_filename, 'wb') as out_file:
		shutil.copyfileobj(response.raw, out_file)

def render_latex(output_format, latex, dest_filename):
	payload = {'code': latex, 'format': output_format}
	response = requests.post('http://rtex.probablyaweb.site/api/v2', data = payload)
	response.raise_for_status()
	jdata = response.json()
	if jdata['status'] != 'success':
		raise Exception('Failed to render LaTeX')
	url = HOST + '/api/v2/' + jdata['filename']
	sys.stdout.write(url)
	#print(jdata['filename'])
	#download_file(url, dest_filename)

#sys.stderr.write(LATEX)
render_latex('png', LATEX, './out.pdf')