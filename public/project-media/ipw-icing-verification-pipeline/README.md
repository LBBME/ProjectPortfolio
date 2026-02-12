IPW2 Post-Processing Wrapper (PACE-ready)

Goal
- Drop this wrapper folder into a directory that contains your Tecplot-readable ICE3D surface datasets
  (typically: ice.dat and map.dat), then run ONE command to generate:
  - Slice cuts (clean & iced) at requested span stations
  - Thickness curves in IPW2-comparable CSV format (thickness_s_y_*.csv)
  - MCCS.dat in IPW2 tool output format
  - Optional quick plots (MATLAB scripts provided)

This wrapper DOES NOT modify the official IPW2 tools; it only calls them:
  cutTool_ipw.py, mccsTool_ipw.py
and computes thickness directly from the “Ice thickness  (m)” field present in your cut files.

Why thickness is computed from field
- The provided iceThicknessTool_ipw.py can fail when element connectivity is missing/degenerate in slice outputs.
- Your cut files already contain:
    VARIABLES ... "s" "x2d" "y2d" ... "Ice thickness  (m)"
  so thickness(s) can be formed robustly without connectivity.

Requirements (PACE)
1) Tecplot 360 module available (provides tec360 and tec360-env)
2) A Python environment that can import `tecplot` (PyTecplot):
   - If you already have one (recommended), set PYTECPLOT_VENV to its activate path.
     Example: export PYTECPLOT_VENV=$HOME/scratch/pytecplot_venv/bin/activate

Inputs expected in your ICE3D results directory
- ice.dat  : Tecplot ASCII/plt dataset with iced surface fields
- map.dat  : Tecplot ASCII/plt dataset with clean surface fields
If you do not have these, you must convert ICE3D outputs to Tecplot first (separate step).

Quick start
1) Copy these files into your ICE3D output directory (same folder where ice.dat and map.dat live):
   - run_ipw2_post.sh
   - ipw2_post_config.sh   (optional to edit)
   - matlab/ (optional)

2) Edit ipw2_post_config.sh if needed (tool path, stations, resolution).

3) Run:
   bash run_ipw2_post.sh

Outputs
- ipw_outputs/
    cuts_clean/clean_y_*.dat
    cuts_ice/ice_y_*.dat
    thickness/thickness_s_y_*.csv
    mccs/MCCS.dat

MATLAB plotting
- matlab/plot_thickness.m
- matlab/plot_mccs.m

Notes
- The wrapper auto-detects whether your Tecplot file variables are named X/Y/Z or CoordinateX/Y/Z.
- MCCS bounding box and Y-extremums are auto-computed from the iced dataset.
