def matching(ref, est, window=0.5):
    
    n_ref, n_est = len(ref), len(est)
    
    D = np.zeros((n_ref + n_est, n_ref + n_est))
    M = (np.abs(np.subtract.outer(ref, est)) <= window).astype(int)
    
    # If we build the skew-symmetric adjacency matrix D, then rank(D) = 2 * maximum matching
    D[:n_ref, n_ref:] = M
    D[n_ref:, :n_ref] = -M.T
    
    vals = np.abs(scipy.linalg.eig(D)[0])
    rank = sum(vals > 1e-10)
    matching_size = rank / 2.0
    
    precision = matching_size / len(est)
    recall = matching_size / len(ref)
    
    f_measure = mir_eval.util.f_measure(precision, recall)
    
    return precision, recall, f_measure