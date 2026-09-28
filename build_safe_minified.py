import os
import re
import subprocess
import shutil

ROOT_DIR = r"c:\Users\USER\Desktop\My apps\Website"
JS_DIR = os.path.join(ROOT_DIR, "js")
CSS_DIR = os.path.join(ROOT_DIR, "css")
DIST_DIR = os.path.join(ROOT_DIR, "dist")
DIST_JS_DIR = os.path.join(DIST_DIR, "js")
DIST_CSS_DIR = os.path.join(DIST_DIR, "css")

ANTI_INSPECT_TAG = '<script src="js/anti-inspect.js"></script>'

def inject_anti_inspect_script(html_content):
    if ANTI_INSPECT_TAG in html_content:
        return html_content
    
    if "<head>" in html_content:
        return html_content.replace("<head>", f"<head>\n  {ANTI_INSPECT_TAG}")
    elif "<HEAD>" in html_content:
        return html_content.replace("<HEAD>", f"<HEAD>\n  {ANTI_INSPECT_TAG}")
    return html_content

def minify_css(css_content):
    content = re.sub(r'/\*[\s\S]*?\*/', '', css_content)
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r'\s*([\{\}\:\;\,])\s*', r'\1', content)
    return content.strip()

def process_html_files():
    print("Processing HTML files...")
    html_files = [f for f in os.listdir(ROOT_DIR) if f.endswith('.html')]
    for file_name in html_files:
        src_path = os.path.join(ROOT_DIR, file_name)
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated_content = inject_anti_inspect_script(content)
        
        with open(src_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
            
        os.makedirs(DIST_DIR, exist_ok=True)
        dist_path = os.path.join(DIST_DIR, file_name)
        with open(dist_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"  Updated: {file_name}")

def minify_javascript():
    print("Minifying JavaScript files with Terser...")
    os.makedirs(DIST_JS_DIR, exist_ok=True)
    js_files = [f for f in os.listdir(JS_DIR) if f.endswith('.js')]
    
    for file_name in js_files:
        src_file = os.path.join(JS_DIR, file_name)
        dist_file = os.path.join(DIST_JS_DIR, file_name)
        
        # Use terser for clean, production-grade minification
        terser_cmd = [
            "npx.cmd" if os.name == 'nt' else "npx",
            "terser", src_file,
            "-o", dist_file,
            "--compress",
            "--mangle"
        ]
        
        try:
            res = subprocess.run(terser_cmd, capture_output=True, text=True, cwd=ROOT_DIR)
            if res.returncode == 0:
                print(f"  Minified JS: {file_name}")
                shutil.copyfile(dist_file, src_file)
            else:
                print(f"  Terser error on {file_name}: {res.stderr}")
        except Exception as e:
            print(f"  Error processing {file_name}: {e}")

def process_css_files():
    print("Minifying CSS files...")
    os.makedirs(DIST_CSS_DIR, exist_ok=True)
    css_files = [f for f in os.listdir(CSS_DIR) if f.endswith('.css')]
    
    for file_name in css_files:
        src_file = os.path.join(CSS_DIR, file_name)
        dist_file = os.path.join(DIST_CSS_DIR, file_name)
        
        with open(src_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        minified = minify_css(content)
        
        with open(dist_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        with open(src_file, 'w', encoding='utf-8') as f:
            f.write(minified)
            
        print(f"  Minified CSS: {file_name}")

if __name__ == "__main__":
    process_html_files()
    process_css_files()
    minify_javascript()
    print("Safe build and protection completed successfully!")
