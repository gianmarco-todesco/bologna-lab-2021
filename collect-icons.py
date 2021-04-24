from os.path import dirname, realpath, join, exists
from os import listdir
from shutil import copyfile

root = dirname(realpath(__file__))
projects_path = join(root, "web","projects")
icons_path = join(root, "web","icons")

for d in listdir(projects_path):
    icon_path = join(projects_path, d, 'icon.png')
    if exists(icon_path):
        dst = join(icons_path, d + ".png")
        print(icon_path)
        print(dst)
        copyfile(icon_path, dst)

        
        
