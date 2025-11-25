class ScriptCommand:
    def __init__(self, commandName=None):
        self.sendAsPrimary = True
        self.primary_prefix = "def "
        self.secondary_prefix = "sec "
        if commandName:
            self.programName = f"{commandName}():\n" 
        else:
            self.programName = "myCustomScript():\n"
        self.postfix = "end\n"
        self.commandContent = ""

    def appendLine(self, command):
        self.commandContent += f" {command}\n"

    def setAsPrimaryProgram(self):
        self.sendAsPrimary = True

    def setAsSecondaryProgram(self):
        self.sendAsPrimary = False

    def isPrimaryProgram(self):
        return self.sendAsPrimary

    def __str__(self):
        if self.sendAsPrimary:
            command = self.primary_prefix
        else:
            command = self.secondary_prefix

        command += self.programName
        command += self.commandContent
        command += self.postfix
        return command