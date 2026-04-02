import os
import re
from bs4 import BeautifulSoup

html_dir = '/Users/shanmugam/Desktop/Gowtham/Woodenhut'
pages_dir = '/Users/shanmugam/Desktop/Gowtham/Woodenhut/frontend/src/pages'

for filename in os.listdir(html_dir):
    if filename.endswith('.html'):
        with open(os.path.join(html_dir, filename), 'r') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        body = soup.find('body')
        if body:
            # Remove style tags
            for style in body.find_all('style'):
                style.decompose()
            
            # Remove class and style attributes
            for tag in body.find_all():
                if 'class' in tag.attrs:
                    del tag.attrs['class']
                if 'style' in tag.attrs:
                    del tag.attrs['style']
            
            # Get the HTML string
            html_str = str(body)
            # Remove <body> and </body>
            html_str = html_str.replace('<body>', '').replace('</body>', '')
            
            # Replace href="something.html" with href="/something"
            html_str = re.sub(r'href="([^"]*)\.html"', r'href="/\1"', html_str)
            # For index.html, make it /
            html_str = html_str.replace('href="/index"', 'href="/"')
            
            # Escape single quotes and backslashes for JavaScript string
            html_str = html_str.replace('\\', '\\\\').replace("'", "\\'")
            
            # Create component name
            component_name = ''.join(word.title() for word in filename.replace('.html', '').split('-')) + 'Page'
            
            js_content = f'''import React from 'react';

const {component_name} = () => {{
  const htmlContent = '{html_str}';
  return (
    <div dangerouslySetInnerHTML={{{{__html: htmlContent}}}}}} />
  );
}};

export default {component_name};
'''
            
            js_filename = filename.replace('.html', '.jsx')
            with open(os.path.join(pages_dir, js_filename), 'w') as f:
                f.write(js_content)