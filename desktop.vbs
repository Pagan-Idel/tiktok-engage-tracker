Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("WScript.Shell")

' Define the base folder path
baseFolder = "C:\Documents\"

' Define the folder name prefix you're looking for
folderPrefix = "tiktok-engage-tracker"

' Loop through the folders in the base folder to find the correct one
Set objFolder = objFSO.GetFolder(baseFolder)
For Each subFolder In objFolder.SubFolders
    If InStr(subFolder.Name, folderPrefix) > 0 Then
        ' When a matching folder is found, run the BAT file inside it
        objShell.Run "cmd /c " & baseFolder & subFolder.Name & "\run.bat", 7
        Exit For
    End If
Next
