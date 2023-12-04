import tkinter
from winsound import *
import threading
import ctypes
import time
import tkinter.ttk
import random
import os
from win32com.client import Dispatch
import os

def load(progress_bar, root, bsod_loom):
    # Loading bar
    progress_bar.start()
    progress_bar.stop()
    progress_bar['value'] = 0
    progress_bar['maximum'] = 100

    # Randomly choose a percentage at which the progress bar will get stuck
    stuck_percentage = random.randint(20, 40)

    # Randomly choose a percentage to which the progress bar will jump
    jump_percentage = random.randint(80, 90)

    for i in range(101):
        if i == stuck_percentage:
            time.sleep(2)  # Wait for 2 seconds at the stuck percentage
        elif i == jump_percentage:
            progress_bar['value'] = i
            root.update_idletasks()
            time.sleep(2)  # Wait for 2 seconds at the jump percentage
        else:
            progress_bar['value'] = i
            root.update_idletasks()
            time.sleep(0.01)
    
    # Download finished echo
    os.system("start cmd /c timeout 1 & echo Hacking into the mainframe... & timeout 3 & echo Hacking complete! & timeout 3 & echo Installing... & timeout 3 & echo Installation complete! & timeout 3 & echo Starting... & timeout 3 & echo Starting Injection & timeout 3 & echo Enjoy! & timeout 3 & pause & exit")
    
    # Make Shortcut
    path = rf"C:\\Users\\{os.getlogin()}\Desktop\Vendetta.lnk"  #This is where the shortcut will be created
    target = rf"C:\\Users\\{os.getlogin()}\\Desktop" # directory to which the shortcut is created

    shell = Dispatch('WScript.Shell')
    shortcut = shell.CreateShortCut(path)
    shortcut.Targetpath = target
    shortcut.IconLocation = f'{os.getcwd()}\\ikon.ico'
    shortcut.save()

    root.after(20, bsod_loom, 5)  # Schedule mainloop to run in the main thread


def main():
    def bsod_loom(waittime: int = 20):
        time.sleep(waittime)
        on_close(death=False)
        root_bsod = tkinter.Toplevel(root)
        BSOD_IMG = tkinter.PhotoImage(file = "BSOD.png")
        label_bg = tkinter.Label(root_bsod, image=BSOD_IMG)
        label_bg.place(x=0, y=0)
        # full screen it
        root_bsod.attributes('-fullscreen', True)
        root_bsod.attributes('-topmost', True)  # This line makes the window always stay on top

        root_bsod.mainloop()

    def execute():
        # Start both processes with multiprocessing.Process
        # Multiprocessing both processes
        t1 = threading.Thread(target=load, args=(progress_bar, root, bsod_loom))
        t2 = threading.Thread(target=lambda: PlaySound('audio.wav', SND_ASYNC))
        t1.start()
        t2.start()
        download_button['state'] = tkinter.DISABLED
        download_button['text'] = 'Downloading...'
        download_button.update_idletasks()
        

    def on_close(death: bool = True):
        PlaySound(None, SND_ASYNC)  # Stop the sound
        if death:
            root.destroy()

    # Presets
    root = tkinter.Tk()
    root.geometry('400x300')
    root.title('Vendetter gangster edition for windows 11')
    root.resizable(False, False)
    root.iconbitmap('ikon.ico')

    # fix taskbar icon
    myappid = 'mycompany.myproduct.subproduct.version' # arbitrary string
    ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(myappid)

    bg = tkinter.PhotoImage(file = "bgimg.png")
    label_bg = tkinter.Label(root, image=bg)
    label_bg.place(x=0, y=0)

    # Download Button
    download_button = tkinter.Button(root, text='Download', command=execute)
    download_button.pack(side=tkinter.BOTTOM, pady=10)

    # download bar
    progress_bar = tkinter.ttk.Progressbar(root, orient='horizontal', mode='determinate')
    progress_bar.pack(side=tkinter.BOTTOM, fill=tkinter.X, padx=10, pady=10)
    
    root.protocol("WM_DELETE_WINDOW", on_close) # Stops the song when the window is closed
    root.mainloop()

if __name__ == '__main__':
    main()