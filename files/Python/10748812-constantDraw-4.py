__author__ = 'SurpriseTRex'


def draw_constant(res=10):
    """Re-draws a Read node using Constant nodes as pixels."""
    # Checks that the user has selected a Read node.

    try:
        if nuke.selectedNode().Class() != "Read":
            # Pushes pop up message to the user
            nuke.message("No Read node selected to re-draw!")
            return False
    except ValueError:
        nuke.message("No node selected!")
        return False

    else:
        # Sets the Image Height/Width.
        ih = nuke.selectedNode().height()
        iw = nuke.selectedNode().width()
        # Sets the Node Grid Height/Width, making sure to maintain Aspect
        # Ratio.
        h = res
        w = res * iw / ih

        # The loops construct the grid layout of the pixels.
        for y in range(h):
            for x in range(w):
                        # Construct the Constant nodes and set their position.
                c = nuke.nodes.Constant(xpos=x * 70, ypos=-y * 70)
                # Sets Constant colour to sampled pixels.
                c['color'].setValue([
                    nuke.sample(nuke.selectedNode(), "r",
                                0.5 + (x * (iw / w)), 0.5 + (y * (ih / h))),
                    nuke.sample(nuke.selectedNode(), "g",
                                0.5 + (x * (iw / w)), 0.5 + (y * (ih / h))),
                    nuke.sample(nuke.selectedNode(), "b",
                                0.5 + (x * (iw / w)), 0.5 + (y * (ih / h))),
                    nuke.sample(nuke.selectedNode(), "a",
                                0.5 + (x * (iw / w)), 0.5 + (y * (ih / h)))
                ])

if __name__ == "__main__":
    draw_constant()
